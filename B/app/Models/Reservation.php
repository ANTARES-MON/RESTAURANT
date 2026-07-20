<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Reservation extends Model
{
    protected $fillable = [
        'nom_client',
        'email',
        'telephone',
        'date_reservation',
        'nombre_personnes',
        'commentaires',
        'selected_plats',
        'statut',
    ];
}
