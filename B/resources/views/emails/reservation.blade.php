<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Réservation</title>
</head>
<body style="font-family: Arial, sans-serif; color: #222;">
    <h2 style="margin-bottom: 10px;">
        @if($type === 'confirme')
            Votre réservation est confirmée
        @elseif($type === 'annule')
            Votre réservation est annulée
        @else
            Nous avons bien reçu votre demande
        @endif
    </h2>

    <p><strong>Nom :</strong> {{ $reservation->nom_client }}</p>
    <p><strong>Email :</strong> {{ $reservation->email }}</p>
    <p><strong>Téléphone :</strong> {{ $reservation->telephone }}</p>
    <p><strong>Date & Heure :</strong> {{ \Carbon\Carbon::parse($reservation->date_reservation)->format('d/m/Y H:i') }}</p>
    <p><strong>Convives :</strong> {{ $reservation->nombre_personnes }}</p>

    @if(!empty($selectedPlats))
        <p><strong>Plats sélectionnés :</strong></p>
        <ul>
            @foreach($selectedPlats as $plat)
                <li>
                    {{ $plat['nom'] ?? '' }}
                    @if(!empty($plat['quantity']))
                        (x{{ $plat['quantity'] }})
                    @endif
                </li>
            @endforeach
        </ul>
    @endif

    @if($reservation->commentaires)
        <p><strong>Commentaires :</strong> {{ $reservation->commentaires }}</p>
    @endif

    @if($type === 'confirme')
        <p>Votre réservation est confirmée. Nous avons hâte de vous accueillir.</p>
    @elseif($type === 'annule')
        <p>Votre réservation a été annulée. N'hésitez pas à reprogrammer une nouvelle date.</p>
    @else
        <p>Nous traiterons votre demande et vous confirmerons sous peu.</p>
    @endif

    <p style="margin-top: 20px;">Merci,<br>Le Palais de Minuit</p>
</body>
</html>

