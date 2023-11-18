<?php

namespace App\Http\Controllers;

use Date;
use Exception;
use App\Models\Survey;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;
use App\Models\SurveyAnswer;
use Illuminate\Http\Request;
use App\Models\SurveyQuestion;
use App\Enums\QuestionTypeEnum;
use Illuminate\Validation\Rule;
use App\Models\SurveyQuestionAnswer;
use Illuminate\Support\Facades\File;
use Illuminate\Validation\Rules\Enum;
use App\Http\Resources\SurveyResource;
use App\Http\Requests\SurveyStoreRequest;
use Illuminate\Support\Facades\Validator;
use App\Http\Requests\SurveyUpdateRequest;
use App\Http\Requests\StoreSurveyAnswerRequest;

class SurveyController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user = $request->user();
        return SurveyResource::collection(
            Survey::where('user_id', $user->id)
                ->orderBy('created_at', 'desc')
                ->paginate(3)
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(SurveyStoreRequest $request)
    {
        $data = $request->validated();
        // return $data;

        if (isset($data['image'])) {
            $relativePath = $this->saveImage($data['image']);
            $data['image'] = $relativePath;
        }
        $survey = Survey::make([]);
        $survey->title = $data['title'];
        $survey->image = $data['image'];
        $survey->user_id = $request->user()->id;
        $survey->status = $data['status'];
        $survey->description = $data['description'];
        // $survey->slug = $data['slug'];
        $survey->expire_date = $data['expire_date'];
        $survey->save();
        foreach ($data['questions'] as $question) {
            $question['survey_id'] = $survey->id;
            $this->createQuestion($question);
        }
        return new SurveyResource($survey);
    }

    /**
     * Display the specified resource.
     */
    public function show(Survey $survey, Request $request)
    {
        $user = $request->user();
        if ($user->id !== $survey->user_id) {
            return abort(403, 'unauthorized action');
        }
        return new SurveyResource($survey);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(SurveyUpdateRequest $request, Survey $survey)
    {
        $data = $request->validated();
        if (isset($data['image'])) {
            $relativePath = $this->saveImage($data['image']);
            $data['image'] = $relativePath;

            if ($survey->image) {
                $absolutePath  = public_path($survey->image);
                File::delete($absolutePath);
            }
        }
        $survey->id = $data['id'];
        $survey->title = $data['title'];
        $survey->status = $data['status'];
        $survey->description = $data['description'];
        $survey->expire_date = $data['expire_date'];
        $survey->update();

        $existingIds = $survey->questions()->pluck('id')->toArray();
        $newIds = Arr::pluck($data['questions'], 'id');
        $toDelete = array_diff($existingIds, $newIds);

        $toAdd = array_diff($newIds, $existingIds);
        SurveyQuestion::destroy($toDelete);


        foreach ($data['questions'] as $question) {
            if (in_array($question['id'], $toAdd)) {
                $question['survey_id'] = $survey->id;
                $this->createQuestion($question);
            }
        }


        $questionMap = collect($data['questions'])->keyBy('id');
        foreach ($survey->questions as $question) {
            if (isset($questionMap[$question->id])) {
                $this->updateQuestion($question, $questionMap[$question->id]);
            }
        }

        return new SurveyResource($survey);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Survey $survey, Request $request)
    {
        $user = $request->user();
        if ($user->id !== $survey->user_id) {
            return abort(403, 'Unauthorized action');
        }
        $survey->delete();

        if ($survey->image) {
            $absolutePath = public_path($survey->image);
            File::dalete($absolutePath);
        }

        return response('', 204);
    }




    private function saveImage($image)
    {
        if (preg_match('/^data:image\/(\w+);base64,/', $image, $type)) {
            $image = substr($image, strpos($image, ',') + 1);

            $type = strtolower($type[1]);

            if (!in_array($type, ['jpg', 'jpeg', 'gif', 'png'])) {
                throw new Exception('invalid image type');
            }

            $image = str_replace(" ", "+", $image);
            $image = base64_decode($image);

            if ($image === false) {
                throw new Exception('base64 decode failed');
            }
        } else {
            throw new Exception('did not match data URI with image data');
        }
        $dir  = 'images/';
        $file = Str::random() . "." . $type;

        $absolutePath = public_path($dir);
        $relativePath = $dir . $file;
        if (!File::exists($absolutePath)) {
            File::makeDirectory($absolutePath, 0755, true);
        }
        file_put_contents($relativePath, $image);
        return $relativePath;
    }



    private function createQuestion($data)
    {
        if (is_array($data['data'])) {
            $data['data'] = json_encode($data['data']);
        }

        $validator = Validator::make($data, [
            'question' => "required|string",
            'type' => ['required', new Enum(QuestionTypeEnum::class)],
            "description" => "nullable|string",
            "data" => 'present',
            "survey_id" => "exists:surveys,id"
        ]);
        $question_data = $validator->validated();
        $survey =  SurveyQuestion::make([]);
        $survey->question = $question_data['question'];
        $survey->type = $question_data['type'];
        $survey->description = $question_data['description'];
        $survey->data = $question_data['data'];
        $survey->survey_id = $question_data['survey_id'];
        return $survey->save();
    }



    private function updateQuestion(SurveyQuestion $question, $data)
    {
        if (is_array($data['data'])) {
            $data['data'] = json_encode($data['data']);
        }

        $validator = Validator::make(
            $data,
            [
                "id" => "exists:App\Models\SurveyQuestion,id",
                "question" => 'required|string',
                "type" => ['required', new Enum(QuestionTypeEnum::class)],
                "description" => "nullable|string",
                "data" => "present"
            ]
        );
        $question_data = $validator->validated();
        $question->id = $question_data['id'];
        $question->question = $question_data['question'];
        $question->type = $question_data['type'];
        $question->description = $question_data['description'];
        $question->data = $question_data['data'];

        return $question->update();
    }



    public function getBySlug(Survey $survey){
        if (!$survey->status) {
            return response("",404);
        }
        
$currentDate = new Date();
$expireDate = new \Date($survey->expire_date);
if ($currentDate > $expireDate) {
    return response("",404);
    
}

return new SurveyResource($survey);
    }


    public function storAnswer(StoreSurveyAnswerRequest $request , Survey $survey){
        $validated = $request->validated();
        $surveyAnswer = SurveyAnswer::make([]);
        $surveyAnswer->survey_id = $survey->id;
        // $surveyAnswer->start_date = $validated['start_date'];
        // $surveyAnswer->end_date = $validated['end_date'];
        $surveyAnswer->start_date = date("Y-m-d H:i:s");
        $surveyAnswer->end_date = date("Y-m-d H:i:s");
        $surveyAnswer->save();

        foreach ($validated['answers'] as $questionId => $answer) {
            $question = SurveyQuestion::where(['id'=>$questionId,'survey_id'=>$survey->id])->get();
            if (!$question) {
                return response("Invalid Question ID :\"$questionId\"",400);
            }
        

        $questionAnswer = SurveyQuestionAnswer::make([]);

        $questionAnswer->survey_question_id = $questionId; 
        $questionAnswer-> survey_answer_id = $surveyAnswer->id; 
        $questionAnswer->answer = is_array($answer) ? json_encode($answer):$answer;
        $questionAnswer->save(); 
        }
        return response("",201);
    }
}
