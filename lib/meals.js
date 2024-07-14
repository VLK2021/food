import fs from 'node:fs';

import sql from 'better-sqlite3';
import slugify from 'slugify';
import xss from 'xss';

const db = sql('meals.db');

export async function getMeals() {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // throw new Error('Loading meals failed');
    return db.prepare('SELECT * FROM meals').all();
}


export function getMeal(slug) {
    return db.prepare('SELECT * FROM meals WHERE slug = ?').get(slug);
}


export async function saveMeal(meal) {
    meal.slug = slugify(meal.title, { lower: true });
    meal.instructions = xss(meal.instructions);

    const extension = meal.image.name.split('.').pop();
    const fileName = `${meal.slug}.${extension}`;

    const stream = fs.createWriteStream(`public/images/${fileName}`);
    const bufferedImage = await meal.image.arrayBuffer();

    stream.write(Buffer.from(bufferedImage), (error) => {
        if (error) {
            throw new Error('Saving image failed!');
        }
    });

    meal.image = `/images/${fileName}`;

    db.prepare(`
    INSERT INTO meals
      (title, summary, instructions, creator, creator_email, image, slug)
    VALUES (
      @title,
      @summary,
      @instructions,
      @creator,
      @creator_email,
      @image,
      @slug
    )
  `).run(meal);
}


export async function deleteMeal(slug) {
    const meal = db.prepare(`
        SELECT image FROM meals
        WHERE slug = ?
    `).get(slug);

    if (meal) {
        const imagePath = `public${meal.image}`;
        fs.unlink(imagePath, (err) => {
            if (err) throw new Error('Failed to delete image');
        });

        db.prepare(`
            DELETE FROM meals
            WHERE slug = ?
        `).run(slug);
    } else {
        throw new Error('Meal not found');
    }
}


