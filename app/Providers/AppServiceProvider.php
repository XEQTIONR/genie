<?php

namespace App\Providers;

use App\Models\Project;
use Illuminate\Support\ServiceProvider;
use Laravel\Sanctum\PersonalAccessToken;
use Illuminate\Support\Facades\Gate;
use App\Models\User;

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

        if ($this->app->environment('local') && class_exists(\Laravel\Telescope\TelescopeServiceProvider::class)) {
            $this->app->register(\Laravel\Telescope\TelescopeServiceProvider::class);
            $this->app->register(TelescopeServiceProvider::class);
        }
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Gate::define('view-project', function(User $user, Project $project) {
            // assumed that project is private
            $owner = $project->owner;

            if (get_class($owner) === User::class && $user->id === $owner->id) {
                return true;
            }

            return false;
        });
    }
}
