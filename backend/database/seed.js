import { statSync } from 'node:fs'
import { join } from 'node:path'
import { Database } from './database.js'

const uploadsDir = 'backend/uploads'

const catFiles = ['cat1.jpg', 'cat2.jpg', 'cat3pg.jpg', 'cat4.jpg', 'cat5jpg.jpg']
const dogFiles = ['dog1.jpg', 'dog2jpg.jpg', 'dog3.jpg', 'dog4.jpg', 'dog5jpg.jpg']

const veggieSingles = [
  { file: 'brocoli.jpg', name: 'Broccoli' },
  { file: 'carrot.jpg', name: 'Carrot' },
  { file: 'corn.jpg', name: 'Corn' },
  { file: 'pepper.jpg', name: 'Pepper' },
]

const veggieDishes = [
  { file: 'brocoli-corn.jpg', caption: 'Broccoli and corn', people: ['Broccoli', 'Corn'] },
  { file: 'brocoli-corn-pepper-carrot.jpg', caption: 'Broccoli, corn, pepper and carrot', people: ['Broccoli', 'Corn', 'Pepper', 'Carrot'] },
  { file: 'carrots-corn.jpg', caption: 'Carrots and corn', people: ['Carrot', 'Corn'] },
  { file: 'carrots-peper-brocoli.jpg', caption: 'Carrots, pepper and broccoli', people: ['Carrot', 'Pepper', 'Broccoli'] },
]

export function seedDatabase() {
  Database.Persons.removeAllPersons()
  Database.Photos.removeAllPhotos()
  Database.Albums.removeAllAlbums()

  const catsAlbum = Database.Albums.addAlbum({
    name: 'Cats',
    color: '#dbeafe',
    description: 'Cat photos',
  })

  const dogsAlbum = Database.Albums.addAlbum({
    name: 'Dogs',
    color: '#fef3c7',
    description: 'Dog photos',
  })

  const veggiesAlbum = Database.Albums.addAlbum({
    name: 'Vegetables',
    color: '#dcfce7',
    description: 'Vegetable photos',
  })

  for (const file of catFiles) {
    addPhoto(catsAlbum.id, file, file.replace(/\..+$/, ''))
  }

  for (const file of dogFiles) {
    addPhoto(dogsAlbum.id, file, file.replace(/\..+$/, ''))
  }

  const peopleByName = {}

  for (const { file, name } of veggieSingles) {
    const photo = addPhoto(veggiesAlbum.id, file, name)
    peopleByName[name] = { avatarPhotoId: photo.id }
  }

  const dishPhotos = {}

  for (const dish of veggieDishes) {
    dishPhotos[dish.file] = addPhoto(veggiesAlbum.id, dish.file, dish.caption)
  }

  for (const { file, name } of veggieSingles) {
    const linkedDish = veggieDishes.find(d => d.people.includes(name))
    const person = Database.Persons.addPerson({
      name,
      avatar_id: peopleByName[name].avatarPhotoId,
      photo_id: dishPhotos[linkedDish.file].id,
    })
    peopleByName[name].personId = person.id
  }

  for (const { name } of veggieSingles) {
    Database.Photos.setPhotoPeople(peopleByName[name].avatarPhotoId, [peopleByName[name].personId])
  }

  for (const dish of veggieDishes) {
    const personIds = dish.people.map(n => peopleByName[n].personId)
    Database.Photos.setPhotoPeople(dishPhotos[dish.file].id, personIds)
  }
}

function fileSize(filename) {
  return statSync(join(uploadsDir, filename)).size
}

function addPhoto(albumId, filename, caption) {
  return Database.Photos.addPhoto({
    album_id: albumId,
    hash: filename,
    name: filename,
    size_bytes: fileSize(filename),
    caption,
    taken_at: '2024-06-15',
  })
}