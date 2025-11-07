<?php

namespace Database\Seeders;

use App\Models\Team;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $me = User::firstOrCreate(
            ['email' => 'x.e.q.tionrz@gmail.com'],
            [
                'name' => 'Ovi Hussain',
                'username' => 'xeqtionr',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );

        $users1 = User::factory(10)->create();
        $users2 = User::factory(10)->create();

        $teams = Team::factory(3, [
            'creator_id' => $me->id,
            'owner_id' => $me->id,
        ])->create();

        $teams->each(function(Team $team) use ($me, $users2) {
            $team->users()->saveMany([
                $me,
                ...$users2,
            ]);
        });
    }
}
