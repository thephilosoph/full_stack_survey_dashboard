<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\SurveyController;
use App\Http\Controllers\DashboardController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::post('signup', [AuthController::class, "signup"]);
Route::post('login', [AuthController::class, "login"]);
Route::get("survey/get-by-slug/{survey:slug}", [SurveyController::class, "getBySlug"]);
Route::post('survey/{survey}/answer', [SurveyController::class, "storAnswer"]);

Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('survey', SurveyController::class);
    Route::post('logout', [AuthController::class, "logout"]);
    Route::get("me", [AuthController::class, "me"]);
    Route::get("dashboard", [DashboardController::class, "index"]);
});
