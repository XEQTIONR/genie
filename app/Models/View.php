<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class View extends Model
{
    protected $fillable = [
        'viewable_type',
        'viewable_id',
        'user_id'
    ];
}
