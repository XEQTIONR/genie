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
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->string('release_title')->nullable();
            $table->text('description')->nullable();
            $table->text('excerpt')->nullable();
            $table->text('body')->nullable();
            $table->json('platforms')->nullable();
            $table->json('cover_media')->nullable();
            $table->string('visibility')->default('public');
            $table->json('tools')->nullable();
            $table->boolean('released')->default(false);
            $table->date('released_on')->nullable();
            $table->string('status')->nullable();
            
            //$table->foreignId('banner_id')->nullable();
            //$table->foreignId('logo_id')->nullable();
            $table->foreignId('creator_id');
            $table->foreignId('owner_id');
            $table->string('owner_type');
            $table->timestamps();

            $table->foreign('creator_id')
                ->references('id')
                ->on('users')
                ->onDelete('restrict')
                ->onUpdate('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
