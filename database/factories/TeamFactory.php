<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Team>
 */
class TeamFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $slug = fake()->slug();
        return [
            'name' => fake()->company(),
            'slug' => $slug,
            'avatar' => 'https://api.dicebear.com/9.x/shapes/svg?seed=' . $slug,
            'creator_id' => User::factory(),
            'owner_id' => User::factory(),
        ];
    }
}
