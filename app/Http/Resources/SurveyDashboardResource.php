<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\URL;
use Illuminate\Http\Resources\Json\JsonResource;

class SurveyDashboardResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            "id" => $this->id,
            "title" => $this->title,
            "slug" => $this->slug,
            "image_url" => $this->image ? URL::to($this->image) : null,
            "status" => !!$this->status,
            "expire_date" => $this->expire_date,
            "created_at" => $this->created_at->format('Y-m-d H:i:s'),
            'questions' => $this->questions()->count(),
            "answers" => $this->answers()->count(),
        ];
    }
}
