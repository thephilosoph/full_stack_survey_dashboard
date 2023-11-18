<?php

namespace App\Models;

use App\Models\Survey;
use Illuminate\Database\Eloquent\Model;
use App\Http\Controllers\DashboardController;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class SurveyAnswer extends Model
{
    public $timestamps = false;
    use HasFactory;

    public function survey()
    {
        return $this->belongsTo(Survey::class);
    }
}
