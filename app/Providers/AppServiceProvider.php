<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Laravel\Sanctum\PersonalAccessToken;
class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->singleton(PersonalAccessToken::class, function() {
            $user = request()->user();
                if ($user) {
                    $token = request()->session()->get('apiToken');

                    if ($token) {
                        return $token;
                    }
                    $token = $user->createToken('default-token')->plainTextToken;
                    
                    request()->session()->put('apiToken', $token);

                    return $token;
                }
                return null;
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
