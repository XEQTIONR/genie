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
        Schema::table('users', function (Blueprint $table) {
            $table->string('username')->unique()->after('id');
            $table->json('location')->nullable()->after('password');
            $table->text('bio')->nullable()->after('location');
            $table->string('status')->nullable()->after('bio');
            $table->string('state')->nullable()->after('status');
            $table->json('meta')->nullable()->after('state');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropUnique('users_username_unique');
            $table->dropColumn('username');
            $table->dropColumn('location');
            $table->dropColumn('bio');
            $table->dropColumn('status');
            $table->dropColumn('state');
            $table->dropColumn('meta');
        });
    }
};
