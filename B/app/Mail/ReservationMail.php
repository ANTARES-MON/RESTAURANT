<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use App\Models\Reservation;

class ReservationMail extends Mailable
{
    use Queueable, SerializesModels;

    public Reservation $reservation;
    public string $type;

    public function __construct(Reservation $reservation, string $type)
    {
        $this->reservation = $reservation;
        $this->type = $type;
    }

    public function build()
    {
        $subject = match ($this->type) {
            'confirme' => 'Votre réservation est confirmée',
            'annule' => 'Votre réservation est annulée',
            default => 'Votre demande de réservation',
        };

        return $this->subject($subject)
            ->from(config('mail.from.address'), config('mail.from.name'))
            ->view('emails.reservation')
            ->with([
                'reservation' => $this->reservation,
                'type' => $this->type,
                'selectedPlats' => $this->reservation->selected_plats
                    ? json_decode($this->reservation->selected_plats, true)
                    : [],
            ]);
    }
}

