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
        Schema::create('team_invitations', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignId('team_id');
            $table->foreignId('inviter_id');
            $table->foreignId('invitee_id')->nullable();
            $table->string('to_email')->nullable();
            $table->json('roles')->nullable();
            $table->json('permissions')->nullable();
            $table->timestamps();

            $table->foreign('team_id')->references('id')->on('teams');
            $table->foreign('inviter_id')->references('id')->on('users');
            $table->foreign('invitee_id')->references('id')->on('users');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('team_invitations');
    }
};
