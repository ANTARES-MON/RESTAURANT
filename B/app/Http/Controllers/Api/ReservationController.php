<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Reservation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use App\Mail\ReservationMail;

class ReservationController extends Controller
{
    public function index()
    {
        return response()->json(Reservation::latest()->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom_client' => 'required|string',
            'email' => 'required|email',
            'telephone' => 'required|string',
            'date_reservation' => 'required|date|after:now',
            'nombre_personnes' => 'required|integer|min:1|max:6',
            'commentaires' => 'nullable|string',
            'selected_plats' => 'nullable|string',
        ]);

        $res = Reservation::create($validated);

        try {
            Mail::to($res->email)->send(new ReservationMail($res, 'created'));
        } catch (\Throwable $e) {

        }

        return response()->json(['message' => 'Réservation envoyée avec succès', 'data' => $res], 201);
    }

    public function update(Request $request, $id)
    {
        $reservation = Reservation::findOrFail($id);

        $validated = $request->validate([
            'statut' => 'required|string|in:en_attente,confirme,annule'
        ]);

        $reservation->update(['statut' => $validated['statut']]);
        $reservation->refresh();

        try {
            if ($reservation->statut === 'confirme') {
                Mail::to($reservation->email)->send(new ReservationMail($reservation, 'confirme'));
            } elseif ($reservation->statut === 'annule') {
                Mail::to($reservation->email)->send(new ReservationMail($reservation, 'annule'));
            }
        } catch (\Throwable $e) {
            Log::error('Email sending failed: ' . $e->getMessage(), [
                'reservation_id' => $reservation->id,
                'email' => $reservation->email,
                'statut' => $reservation->statut,
                'error' => $e->getTraceAsString()
            ]);
        }

        return response()->json([
            'message' => 'Statut mis à jour',
            'data' => $reservation
        ]);
    }
}
