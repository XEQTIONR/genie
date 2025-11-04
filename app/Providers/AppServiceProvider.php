<?php

namespace App\Providers;

use App\Models\Project;
use Illuminate\Support\ServiceProvider;
use Laravel\Sanctum\PersonalAccessToken;
use Illuminate\Support\Facades\Gate;
use App\Models\User;
use Illuminate\Support\Facades\Log;

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
        Gate::define('view-project', function(User $user, Project $project) {
            if ($project->visibility === 'public') {
                return true;
            }

            $owner = $project->owner;

            if (get_class($owner) === User::class && $user->id === $owner->id) {
                return true;
            }

            return false;
        });
    }
}
