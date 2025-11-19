<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('job_openings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('team_id');
            $table->string('title');
            $table->text('body');
            $table->string('compensation_type');
            $table->string('compensation')->nullable();
            $table->json('location');
            $table->json('type');
            $table->json('roles')->nullable();
            $table->string('status');
            $table->string('visibility');
            $table->timestamps();

            $table->foreign('team_id')->references('id')->on('teams');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('job_openings');
    }
};
