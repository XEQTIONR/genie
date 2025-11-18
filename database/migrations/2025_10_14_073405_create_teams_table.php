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
        Schema::create('teams', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug');
            $table->string('type')->default('team');
            $table->string('avatar')->nullable();
            $table->string('banner')->nullable();
            $table->string('location')->nullable();
            $table->text('description')->nullable();
            $table->json('meta')->nullable();
            $table->foreignId('creator_id');
            $table->foreignId('owner_id');
            $table->timestamps();

            $table->foreign('creator_id')->references('id')->on('users')
                ->onDelete('restrict')->onUpdate('cascade');

            $table->foreign('owner_id')->references('id')->on('users')
                ->onDelete('restrict')->onUpdate('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('teams');
    }
};
