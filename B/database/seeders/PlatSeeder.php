<?php

namespace Database\Seeders;

use App\Models\Plats;
use Illuminate\Database\Seeder;

class PlatSeeder extends Seeder
{
    public function run(): void
    {
        $plats = [
            [
                'nom' => 'MÉCHOUI: TRADITIONAL ROAST LAMB',
                'description' => 'Slow-roasted lamb marinated with traditional Moroccan spices, served with roasted vegetables and aromatic herbs. A celebration of authentic Moroccan flavors.',
                'composition' => 'Lamb shoulder, cumin, coriander, paprika, garlic, preserved lemons, olive oil, fresh herbs, seasonal vegetables',
                'prix' => 450.00,
                'categorie' => 'Main',
                'image' => 'https://lesvillasdemyriam.com/wp-content/uploads/2025/01/plats-marocains-4.webp',
            ],
            [
                'nom' => 'TAGINE DE POULET AUX OLIVES',
                'description' => 'Tender chicken cooked in a traditional tagine with green olives, preserved lemons, and a blend of Moroccan spices. Served with couscous.',
                'composition' => 'Chicken thighs, green olives, preserved lemons, onions, garlic, ginger, saffron, turmeric, cilantro, couscous',
                'prix' => 280.00,
                'categorie' => 'Main',
                'image' => 'https://images.radio-canada.ca/v1/alimentation/recette/4x3/tajine-poulet-olives-citron-confit.jpg',
            ],
            [
                'nom' => 'PASTILLA AU POULET',
                'description' => 'A delicate pastry filled with spiced chicken, almonds, and eggs, dusted with cinnamon and powdered sugar. A perfect balance of sweet and savory.',
                'composition' => 'Phyllo pastry, chicken, almonds, eggs, onions, parsley, cilantro, cinnamon, sugar, butter, saffron',
                'prix' => 320.00,
                'categorie' => 'Main',
                'image' => 'https://lesvillasdemyriam.com/wp-content/uploads/2025/01/plats-marocains-2.webp',
            ],
            [
                'nom' => 'COUSCOUS: A MOROCCAN FRIDAY STAPLE',
                'description' => 'Traditional Moroccan couscous served with lamb, chicken, merguez sausage, and seasonal vegetables. A royal feast of flavors.',
                'composition' => 'Couscous, lamb shank, chicken, merguez sausage, carrots, zucchini, turnips, chickpeas, raisins, harissa',
                'prix' => 380.00,
                'categorie' => 'Main',
                'image' => 'https://lesvillasdemyriam.com/wp-content/uploads/2025/01/plat-marocain.webp',
            ],
            [
                'nom' => 'HARIRA: A COMFORTING, SPICY SOUP',
                'description' => 'A rich and hearty lentil and chickpea soup, traditionally served during Ramadan. Flavored with tomatoes, herbs, and spices.',
                'composition' => 'Lentils, chickpeas, tomatoes, onions, celery, cilantro, parsley, turmeric, ginger, cinnamon, vermicelli',
                'prix' => 120.00,
                'categorie' => 'Starter',
                'image' => 'https://lesvillasdemyriam.com/wp-content/uploads/2025/01/un-plat-marocain.webp',
            ],
            [
                'nom' => 'PASTILLA AUX AMANDES',
                'description' => 'Pastilla sucrée-salée au poulet et aux amandes caramélisées, parfumée à la cannelle.',
                'composition' => 'Feuilles de pastilla, poulet effiloché, amandes, cannelle, sucre glace, beurre',
                'prix' => 150.00,
                'categorie' => 'Dessert',
                'image' => 'https://images.unsplash.com/photo-1485962398705-ef6a13c41e8f?w=800',
            ],
            [
                'nom' => 'ORANGE À LA CANNELLE',
                'description' => 'Tranches d’orange fraîches, cannelle et fleur d’oranger pour finir en douceur.',
                'composition' => 'Oranges, cannelle, fleur d’oranger, sucre',
                'prix' => 90.00,
                'categorie' => 'Dessert',
                'image' => 'https://images.unsplash.com/photo-1502741338009-cac2772e18bc?w=800',
            ],
            [
                'nom' => 'THÉ À LA MENTHE ROYAL',
                'description' => 'Thé vert infusé avec une menthe fraîche abondante et du sucre, servi chaud.',
                'composition' => 'Thé vert, menthe fraîche, sucre',
                'prix' => 45.00,
                'categorie' => 'Boissons',
                'image' => 'https://www.bienmanger.com/tinyMceData/images/contents/513/content_lg.jpg',
            ],
            [
                'nom' => 'JUS D’ORANGE PRESSÉ',
                'description' => 'Jus d’orange frais pressé à la minute.',
                'composition' => 'Oranges fraîches',
                'prix' => 55.00,
                'categorie' => 'Boissons',
                'image' => 'https://www.instagrume.com/modules/prestablog/views/img/grid-for-1-7/up-img/78.jpg',
            ],
        ];

        foreach ($plats as $platData) {
            Plats::create($platData);
        }
    }
}

