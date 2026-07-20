<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Plats;
use Illuminate\Http\Request;

class PlatController extends Controller
{
    public function index()
    {
        return response()->json(Plats::all());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'description' => 'required|string',
            'composition' => 'nullable|string',
            'prix' => 'required|numeric|min:0',
            'categorie' => 'required|string|in:Starter,Main,Dessert,Boissons',
            'image' => 'nullable|string',
        ]);

        $plat = Plats::create($validated);
        return response()->json($plat, 201);
    }

    public function show($id)
    {
        $plat = Plats::find($id);
        if (!$plat) return response()->json(['message' => 'Plat non trouvé'], 404);
        return response()->json($plat);
    }

    public function update(Request $request, $id)
    {
        $plat = Plats::findOrFail($id);
        
        $validated = $request->validate([
            'nom' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'composition' => 'nullable|string',
            'prix' => 'sometimes|required|numeric|min:0',
            'categorie' => 'sometimes|required|string|in:Starter,Main,Dessert,Boissons',
            'image' => 'nullable|string',
        ]);

        $plat->update($validated);
        return response()->json($plat);
    }

    public function destroy($id)
    {
        Plats::destroy($id);
        return response()->json(['message' => 'Plat supprimé']);
    }
}