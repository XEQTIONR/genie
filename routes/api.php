<?php

use App\Http\Controllers\Api\CommentController;
use App\Http\Controllers\Api\LikeController;
use App\Http\Controllers\Api\ViewController;
use App\Http\Controllers\UploadController;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\UploadedFile;

Route::name('api.')->group(function() {
    Route::middleware('auth:sanctum')->group(function() {
        Route::get('/user', function (Request $request) {
            return $request->user();
        })->name('user.show');

        Route::post('/uploads', [UploadController::class, 'store'])->name('uploads.store');

        Route::get('/users', function(Request $request) {
            return User::whereAny(['username', 'email'], $request->q)->first();
        })->name('users.index');

        Route::post('/likes', [LikeController::class, 'store'])->name('likes.store');
        Route::delete('/likes/{like}', [LikeController::class, 'destroy'])->name('likes.destroy');

        Route::post('/views', [ViewController::class, 'store'])->name('views.store');

        Route::post('/comments', [CommentController::class, 'store'])->name('comments.store');

    });
});
