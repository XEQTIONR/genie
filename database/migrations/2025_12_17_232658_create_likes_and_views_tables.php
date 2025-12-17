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
        Schema::create('likes', function (Blueprint $table) {
            $table->id();
            $table->string('likeable_type');
            $table->foreignId('likeable_id');
            $table->foreignId('user_id');
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users');
            $table->unique(['likeable_type', 'likeable_id', 'user_id']);
        });

        Schema::create('views', function (Blueprint $table) {
            $table->id();
            $table->string('viewable_type');
            $table->foreignId('viewable_id');
            $table->foreignId('user_id');
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users');
            $table->unique(['viewable_type', 'viewable_id', 'user_id']);
        });

        Schema::table('posts', function(Blueprint $table) {
            $table->string('num_likes_str')->default("0");
            $table->string('num_views_str')->default("0");
        });

        Schema::table('projects', function(Blueprint $table) {
            $table->integer('num_likes')->default(0);
            $table->integer('num_views')->default(0);
            $table->string('num_likes_str')->default("0");
            $table->string('num_views_str')->default("0");
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('likes');
        Schema::dropIfExists('views');

        Schema::table('posts', function(Blueprint $table) {
            $table->dropColumn('num_likes_str');
            $table->dropColumn('num_views_str');
        });

        Schema::table('projects', function(Blueprint $table) {
            $table->dropColumn('num_likes_str');
            $table->dropColumn('num_views_str');
            $table->dropColumn('num_likes');
            $table->dropColumn('num_views');
        });
    }
};
