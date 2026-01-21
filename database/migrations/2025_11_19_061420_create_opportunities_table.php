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
        Schema::create('opportunities', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('title');
            $table->boolean('publish');
            $table->boolean('multiple');
            $table->string('primary_role')->nullable();
            $table->string('location_type');
            $table->json('locations')->nullable();
            $table->json('tags')->nullable();
            $table->json('work_location');
            $table->json('employment_type');
            $table->string('owner_type');
            $table->foreignId('owner_id');
            $table->foreignId('creator_id');
            $table->text('description');
            $table->string('compensation_type');
            $table->string('compensation')->nullable();
            $table->string('status')->default('created');
            $table->timestamp('expires_at')->nullable();
            $table->timestamps();

            $table->foreign('creator_id')->references('id')->on('users');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('opportunities');
    }
};
