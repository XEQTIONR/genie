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
        User::firstOrCreate(
            ['email' => 'x.e.q.tionrz@gmail.com'],
            [
                'name' => 'Ovi Hussain',
                'username' => 'xeqtionr',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
                'avatar' => null//'https://api.dicebear.com/9.x/bottts-neutral/svg?seed=xeqtionr'
            ]
        );

        User::factory(10)->create();
    }
}
