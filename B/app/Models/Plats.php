<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Plats extends Model
{
    protected $fillable = [
        'nom',
        'description',
        'composition',
        'prix',
        'categorie',
        'image',
    ];
}