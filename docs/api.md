# astroDaily APOD API Documentation

This is a powerful, direct replacement for the NASA's Astronomy Picture of the Day (APOD) API. This API endpoint provides much more features like full-text search (FTS), pagination, sparse fieldsets, and advanced filtering along with compatibility of NASA's standard parameters.

## Overview

- **Base Endpoint:** `GET /api/v1/apod`
- **Authentication:** None auth required. Completely free!
- **Rate Limits:** You can call it unlimited times!
- **Data Limits** Unlimited! Get all the rows at once.
- **CORS:** Fully enabled (`*`).

### Feature Comparison

| Feature                         | NASA API | astroDaily API |
| :------------------------------ | :------- | :------------- |
| **`date`**                      | ✅       | ✅             |
| **`start_date` / `end_date`**   | ✅       | ✅             |
| **`count`** (random)            | ✅       | ✅             |
| **`thumbs`** (video thumbnails) | ✅       | ✅             |
| **`hd`** url                    | ✅       | ✅             |
| **API key**                     | Required | ❌ None        |
| **`q`** (full-text search)      | ❌       | ✅             |
| **`media_type`** filter         | ❌       | ✅             |
| **`page`** + **`limit`**        | ❌       | ✅             |
| **`order`** (`asc`/`desc`)      | ❌       | ✅             |
| **`fields`** (sparse fieldsets) | ❌       | ✅             |
| **`year`** / **`month`** filter | ❌       | ✅             |
| **Pagination meta**             | ❌       | ✅             |

---

## Query Parameters

All parameters are optional.

| Parameter    | Type    | Default | Description                                                                                                                                                                      |
| :----------- | :------ | :------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `date`       | String  | `today` | A string in `YYYY-MM-DD` format indicating the date of the APOD image. Cannot be used with `start_date` or `end_date`.                                                           |
| `start_date` | String  | _none_  | The start of a date range (`YYYY-MM-DD`).                                                                                                                                        |
| `end_date`   | String  | `today` | The end of a date range (`YYYY-MM-DD`).                                                                                                                                          |
| `count`      | Integer | _none_  | Returns randomly chosen APODs).                                                                                                                                              |
| `thumbs`     | Boolean | `false` | If `true`, returns a `thumbnail_url` for video APODs.                                                                                                                            |
| `hd`         | Boolean | `true`  | If `false`, omits the `hdurl` field from the response.                                                                                                                           |
| `q`          | String  | _none_  | **(New)** Full-text search query across APOD titles and explanations.                                                                                                            |
| `media_type` | String  | _none_  | **(New)** Filter by `image` or `video`.                                                                                                                                          |
| `year`       | Integer | _none_  | **(New)** Filter entries by a specific year (e.g., `2023`).                                                                                                                      |
| `month`      | Integer | _none_  | **(New)** Filter entries by a specific month (`1` - `12`).                                                                                                                       |
| `page`       | Integer | `1`     | **(New)** The page number for paginated results.                                                                                                                                 |
| `limit`      | Integer | `10`    | **(New)** Results per page.                                                                                                                                         |
| `order`      | String  | `desc`  | **(New)** Sort order by date: `asc` or `desc`.                                                                                                                                   |
| `fields`     | String  | _all_   | **(New)** Comma-separated list of fields to return. Valid fields: `date`, `title`, `explanation`, `url`, `hdurl`, `media_type`, `service_version`, `copyright`, `thumbnail_url`. |

---

## Response Formats & Examples

To maintain compatibility with existing apps built for the NASA API, the response structure adapts based on your query.

### 1. Single Entry (NASA Compatible)

If you request no parameters, or specifically use the `date` parameter, the API returns a flat JSON object representing a single APOD.

**Request:** `GET /api/v1/apod` OR `GET /api/v1/apod?date=2026-03-28`

```json
{
  "date": "2026-03-28",
  "title": "Robert Goddard and Nell",
  "explanation": "Robert H. Goddard, considered the father of modern rocketry, was born in Worcester Massachusetts in 1882. As a 16 year old, Goddard read H.G. Wells' science fiction classic \"War Of The Worlds\" and dreamed of space flight. By 1926 he had designed, built, and flown the world's first liquid fuel rocket. Launched 100 years ago, on March 16, 1926 from his aunt Effie's farm in Auburn Massachusetts, the rocket dubbed \"Nell\", rose to an altitude of 41 feet in a flight that lasted about 2 1/2 seconds. In this posed photo Goddard stands next to the 10 foot tall rocket, holding the launch stand frame. To achieve a stable flight without the need for fins, the rocket's heavy motor was located at the top, fed by lines from liquid oxygen and gasoline fuel tanks at the bottom. Widely recognized as a gifted experimenter and engineering genius, his rockets were many years ahead of their time. Goddard was awarded over 200 patents in rocket technology, most of them after his death in 1945. A liquid fuel rocket constructed on principles developed by Goddard landed humans on the Moon in 1969.",
  "url": "https://apod.nasa.gov/apod/image/2603/goddardphotop9-1_800.jpg",
  "hdurl": "https://apod.nasa.gov/apod/image/2603/goddardphotop9-1_wb.jpg",
  "media_type": "image",
  "service_version": "v1",
  "copyright": null
}
```

### 2. Date range (NASA Compatible)

Specify start_date OR end_date OR both

**Request:** `GET api/v1/apod?end_date=2026-03-28&limit=2&order=asc` OR `GET api/v1/apod?start_date=1995-06-16&limit=2&order=asc` OR `GET api/v1/apod?start_date=1995-06-16&end_date=2026-03-28limit=2&order=asc`

```json
{
  "meta": {
    "total": 11238,
    "page": 1,
    "limit": 2,
    "total_pages": 5619,
    "order": "desc"
  },
  "results": [
    {
      "date": "2026-03-28",
      "title": "Robert Goddard and Nell",
      "explanation": "Robert H. Goddard, considered the father of modern rocketry, was born in Worcester Massachusetts in 1882. As a 16 year old, Goddard read H.G. Wells' science fiction classic \"War Of The Worlds\" and dreamed of space flight. By 1926 he had designed, built, and flown the world's first liquid fuel rocket. Launched 100 years ago, on March 16, 1926 from his aunt Effie's farm in Auburn Massachusetts, the rocket dubbed \"Nell\", rose to an altitude of 41 feet in a flight that lasted about 2 1/2 seconds. In this posed photo Goddard stands next to the 10 foot tall rocket, holding the launch stand frame. To achieve a stable flight without the need for fins, the rocket's heavy motor was located at the top, fed by lines from liquid oxygen and gasoline fuel tanks at the bottom. Widely recognized as a gifted experimenter and engineering genius, his rockets were many years ahead of their time. Goddard was awarded over 200 patents in rocket technology, most of them after his death in 1945. A liquid fuel rocket constructed on principles developed by Goddard landed humans on the Moon in 1969.",
      "url": "https://apod.nasa.gov/apod/image/2603/goddardphotop9-1_800.jpg",
      "hdurl": "https://apod.nasa.gov/apod/image/2603/goddardphotop9-1_wb.jpg",
      "media_type": "image",
      "service_version": "v1",
      "copyright": null
    },
    {
      "date": "2026-03-27",
      "title": "Hickson 44 in Leo",
      "explanation": "Scanning the skies for galaxies, Canadian astronomer Paul Hickson and colleagues identified some 100 compact groups of galaxies, now appropriately called Hickson Compact Groups. The four prominent galaxies seen in this intriguing telescopic skyscape are one such group, Hickson 44. The Hickson 44 galaxy group is about 100 million light-years distant, far beyond the foreground Milky Way stars, toward the northern springtime constellation Leo. The two spiral galaxies in the center of the image are edge-on NGC 3190 with distinctive, warped dust lanes, and S-shaped NGC 3187. Along with the bright elliptical, NGC 3193 (left) they are also known as Arp 316. The spiral toward the lower right corner is NGC 3185, the 4th member of the Hickson group. Like other galaxies in Hickson groups, these show signs of distortion and enhanced star formation, evidence of a gravitational tug of war that will eventually result in galaxy mergers on a cosmic timescale. The merger process is now understood to be a normal part of the evolution of galaxies, including our own Milky Way. For scale, NGC 3190 is about 75,000 light-years across at the estimated distance of Hickson 44.",
      "url": "https://apod.nasa.gov/apod/image/2603/NGC3190-APOD1024.jpg",
      "hdurl": "https://apod.nasa.gov/apod/image/2603/NGC3190-APOD.jpg",
      "media_type": "image",
      "service_version": "v1",
      "copyright": "Peter Kennett"
    }
  ]
}
```

### 3. Random Entries (NASA Compatible)

Using the `count` parameter returns a flat array of APOD objects.

**Request:** `GET /api/v1/apod?count=3`

```json
[
  {
    "date": "2014-08-01",
    "title": "Tetons and Snake River, Planet Earth",
    "explanation": "An alluring night skyscape, this scene looks west across the Grand Teton National Park, Wyoming, USA, Planet Earth. The Snake River glides through the foreground, while above the Tetons' rugged mountain peaks the starry sky is laced with exceptionally strong red and green airglow. That night, the luminous atmospheric glow was just faintly visible to the eye, its color and wavey structure captured only by a sensitive digital camera. In fact, this contemporary digital photograph matches the location and perspective of a well-known photograph from 1942 - The Tetons and The Snake River , by Ansel Adams, renowned photographer of the American West. Adams' image is one of 115 images stored on the Voyager Golden Record. Humanity's message in a bottle, golden records were onboard both Voyager 1 and Voyager 2 spacecraft, launched in 1977 and now headed toward interstellar space.",
    "url": "https://apod.nasa.gov/apod/image/1408/SnakeTetonsTafreshi.jpg",
    "hdurl": "https://apod.nasa.gov/apod/image/1408/SnakeTetonsTafreshi.jpg",
    "media_type": "image",
    "service_version": "v1",
    "copyright": "Babak Tafreshi"
  },
  {
    "date": "2025-12-29",
    "title": "M1: The Crab Nebula",
    "explanation": "This is the mess that is left when a star explodes.  The Crab Nebula, the result of a supernova seen in 1054 AD, is filled with mysterious filaments.  The filaments are not only tremendously complex but appear to have less mass than expelled in the original supernova and a higher speed than expected from a free explosion.  The featured image was taken by an amateur astronomer in Leesburg, Florida, USA over three nights last month. It was captured in three primary colors but with extra detail provided by specific emission by hydrogen gas. The Crab Nebula spans about 10 light years.  In the Nebula's very center lies a pulsar: a neutron star as massive as the Sun but with only the size of a small town.  The Crab Pulsar rotates about 30 times each second.   Explore the Universe: Random APOD Generator",
    "url": "https://apod.nasa.gov/apod/image/2512/Crab_Chen_960.jpg",
    "hdurl": "https://apod.nasa.gov/apod/image/2512/Crab_Chen_1920.jpg",
    "media_type": "image",
    "service_version": "v1",
    "copyright": "Alan Chen"
  },
  {
    "date": "2002-02-11",
    "title": "Reflection Nebula M78",
    "explanation": "An eerie blue glow and ominous columns of dark dust highlight M78, one of the brightest  reflection nebula on the sky. M78 is visible with a small telescope toward the constellation of Orion.  The dust not only absorbs light, but also reflects the light of several bright blue stars that formed recently in the nebula.  The same type of scattering that colors the daytime sky further enhances the blue color.  M78 is about five light-years across. M78 appears above only as it was 1600 years ago, however, because that is how long it takes light to go from there to here.  M78 belongs to the larger Orion Molecular Cloud Complex that contains the Great Nebula in Orion and the Horsehead Nebula.",
    "url": "https://apod.nasa.gov/apod/image/0202/m78_aao.jpg",
    "hdurl": "https://apod.nasa.gov/apod/image/0202/m78_aao_big.jpg",
    "media_type": "image",
    "service_version": "v1",
    "copyright": "AAO"
  }
]
```

### 4. Video thumbnails (NASA Compatible)

Using the `thumbs` parameter adds a thumbnail for videos

**Request:** `GET /api/v1/apod?date=2026-03-01&thumbs=true`

```json
{
  "date": "2026-03-01",
  "title": "The Moon During a Total Lunar Eclipse",
  "explanation": "How does the Moon's appearance change during a total lunar eclipse?  The featured time-lapse video was digitally processed to keep the Moon bright and centered during the 5-hour eclipse of 2018 January 31.  At first the full moon is visible because only a full moon can undergo a lunar eclipse. Stars move by in the background because the Moon orbits the Earth during the eclipse.  The circular shadow of the Earth is then seen moving across the Moon.  The light blue hue of the shadow's edge is related to why Earth's sky is blue, while the deep red hue of the shadow's center is related to why the Sun appears red when near the horizon.  Tomorrow night, people living in Eastern Asia, Australia, and much of North America may get to see a Total Blood Moon Lunar Eclipse.  Here the term blood refers to the (likely) red color of a fully eclipsed Moon.   Almost Hyperspace: Random APOD Generator",
  "url": "https://apod.nasa.gov/apod/image/2603/TotalLunarEclipse2018.mp4",
  "hdurl": null,
  "media_type": "video",
  "service_version": "v1",
  "copyright": null,
  "thumbnail_url": null
}
```

### 5. Remove hdurl (astroDaily exclusive)

Using the `hd` parameter add/remove `hdurl` field

**Request:** `GET /api/v1/apod?date=2026-03-01&hd=false`

```json
{
  "date": "2026-03-01",
  "title": "The Moon During a Total Lunar Eclipse",
  "explanation": "How does the Moon's appearance change during a total lunar eclipse?  The featured time-lapse video was digitally processed to keep the Moon bright and centered during the 5-hour eclipse of 2018 January 31.  At first the full moon is visible because only a full moon can undergo a lunar eclipse. Stars move by in the background because the Moon orbits the Earth during the eclipse.  The circular shadow of the Earth is then seen moving across the Moon.  The light blue hue of the shadow's edge is related to why Earth's sky is blue, while the deep red hue of the shadow's center is related to why the Sun appears red when near the horizon.  Tomorrow night, people living in Eastern Asia, Australia, and much of North America may get to see a Total Blood Moon Lunar Eclipse.  Here the term blood refers to the (likely) red color of a fully eclipsed Moon.   Almost Hyperspace: Random APOD Generator",
  "url": "https://apod.nasa.gov/apod/image/2603/TotalLunarEclipse2018.mp4",
  "media_type": "video",
  "service_version": "v1",
  "copyright": null
}
```

### 6. Search queries (astroDaily exclusive)

Using the `q` parameter, search across the entire APOD collection.

**Request:** `GET api/v1/apod?q=moon&media_type=video&limit=2`

```json
{
  "meta": {
    "total": 109,
    "page": 1,
    "limit": 2,
    "total_pages": 55,
    "order": "desc",
    "query": "moon"
  },
  "results": [
    {
      "date": "2026-03-01",
      "title": "The Moon During a Total Lunar Eclipse",
      "explanation": "How does the Moon's appearance change during a total lunar eclipse?  The featured time-lapse video was digitally processed to keep the Moon bright and centered during the 5-hour eclipse of 2018 January 31.  At first the full moon is visible because only a full moon can undergo a lunar eclipse. Stars move by in the background because the Moon orbits the Earth during the eclipse.  The circular shadow of the Earth is then seen moving across the Moon.  The light blue hue of the shadow's edge is related to why Earth's sky is blue, while the deep red hue of the shadow's center is related to why the Sun appears red when near the horizon.  Tomorrow night, people living in Eastern Asia, Australia, and much of North America may get to see a Total Blood Moon Lunar Eclipse.  Here the term blood refers to the (likely) red color of a fully eclipsed Moon.   Almost Hyperspace: Random APOD Generator",
      "url": "https://apod.nasa.gov/apod/image/2603/TotalLunarEclipse2018.mp4",
      "hdurl": null,
      "media_type": "video",
      "service_version": "v1",
      "copyright": null
    },
    {
      "date": "2025-12-14",
      "title": "Juno Flyby of Ganymede and Jupiter",
      "explanation": "What would it be like to fly over the largest moon in the Solar System? In 2021, the robotic Juno spacecraft flew past Jupiter's huge moon Ganymede and took images that have been digitally constructed into a detailed flyby. As the featured video begins, Juno swoops over the two-toned surface of the 5,000-km wide moon, revealing an icy alien landscape filled with grooves and craters. The grooves are likely caused by shifting surface plates, while the craters are caused by violent impacts. Continuing on in its orbit, Juno then performed its 34th close pass over Jupiter's clouds. The digitally-constructed video shows numerous swirling clouds in the north, colorful planet-circling zones and bands across the middle -- featuring several white-oval clouds from the String of Pearls, and finally more swirling clouds in the south.",
      "url": "https://www.youtube.com/embed/CC7OJ7gFLvE?rel=0",
      "hdurl": null,
      "media_type": "video",
      "service_version": "v1",
      "copyright": null
    }
  ]
}
```

### 7. Time filter (astroDaily exclusive)

Using the `year` OR `year` OR both the parameters filter the APODs returned

**Request:** `GET api/v1/apod?q=moon&media_type=video&limit=2&year=2026`

```json
{
  "meta": {
    "total": 1,
    "page": 1,
    "limit": 2,
    "total_pages": 1,
    "order": "desc",
    "query": "moon"
  },
  "results": [
    {
      "date": "2026-03-01",
      "title": "The Moon During a Total Lunar Eclipse",
      "explanation": "How does the Moon's appearance change during a total lunar eclipse?  The featured time-lapse video was digitally processed to keep the Moon bright and centered during the 5-hour eclipse of 2018 January 31.  At first the full moon is visible because only a full moon can undergo a lunar eclipse. Stars move by in the background because the Moon orbits the Earth during the eclipse.  The circular shadow of the Earth is then seen moving across the Moon.  The light blue hue of the shadow's edge is related to why Earth's sky is blue, while the deep red hue of the shadow's center is related to why the Sun appears red when near the horizon.  Tomorrow night, people living in Eastern Asia, Australia, and much of North America may get to see a Total Blood Moon Lunar Eclipse.  Here the term blood refers to the (likely) red color of a fully eclipsed Moon.   Almost Hyperspace: Random APOD Generator",
      "url": "https://apod.nasa.gov/apod/image/2603/TotalLunarEclipse2018.mp4",
      "hdurl": null,
      "media_type": "video",
      "service_version": "v1",
      "copyright": null
    }
  ]
}
```

### 8. Limits (astroDaily exclusive)

Using the `limit` for controlling the no. of APODs returned in a single response (1 page)

**Request:** `GET api/v1/apod?q=moon&media_type=video&limit=2&year=2026`

```json
{
  "meta": {
    "total": 714,
    "page": 1,
    "limit": 2,
    "total_pages": 357,
    "order": "desc",
    "query": "nebulae"
  },
  "results": [
    {
      "date": "2026-03-18",
      "title": "Cygnus and the Solitary Tree",
      "explanation": "A lone tree stands in a quiet meadow in Guadalajara, Spain, silhouetted against the Cygnus region rising above like flames in the night sky.  This deep night skyscape is a composite of exposures that reveals a range of brightness and color human eyes can't quite see on their own. Spanning over a thousand times the angular size of the full moon, Cygnus sets the sky afire with active star formation where clouds of gas and dust collapse under gravity until nuclear fusion ignites and new stars are born. These stars  ionize the surrounding hydrogen gas, causing it to glow crimson, while tendrils of interstellar dust absorb some of that light and cast dark shadows across the sky. Cygnus is a trove of celestial treasures, notably the Veil, Crescent, and Pelican nebulae, as well as  Cygnus X-1, the first confirmed black hole.  Cygnus continues to yield fresh science, including a new three-dimensional model of the Cygnus Loop made possible by the Chandra X-ray Observatory.   Almost Hyperspace: Random APOD Generator",
      "url": "https://apod.nasa.gov/apod/image/2603/cygnus_tree_crop.jpg",
      "hdurl": "https://apod.nasa.gov/apod/image/2603/cygnus_tree_crop.jpg",
      "media_type": "image",
      "service_version": "v1",
      "copyright": "2025 Horacio Lander / AstroHoracio\n\nText:\nKeighley Rockcliffe  \n(NASA\nGSFC, \nUMBC CSST, \nCRESST II)"
    },
    {
      "date": "2026-02-20",
      "title": "B93: A Dark Interstellar Ghost",
      "explanation": "\"A ghost in the Milky Way…” says Christian Bertincourt, the astrophotographer behind this striking image of Barnard 93 (B93).  The 93rd entry in Barnard’s Catalogue of Dark Nebulae, B93 lies within the Small Sagittarius Star Cloud (Messier 24), where its darkness stands in stark contrast to bright stars and gas in the background.  In some ways, B93 is really like a ghost, because it contains gas and dust that was dispersed by the deaths of stars, like supernovas.  B93 appears as a dark void not because it is empty, but because its dust blocks the light emitted by more distant stars and glowing gas.  Like other dark nebulas, some gas from B93, if dense and massive enough, will eventually gravitationally condense to form new stars.  If so, then once these stars ignite, B93 will transform from a dark ghost into a brilliant cradle of newborn stars.",
      "url": "https://apod.nasa.gov/apod/image/2602/B93_bertincourt_1080.jpg",
      "hdurl": "https://apod.nasa.gov/apod/image/2602/B93_bertincourt_1178.png",
      "media_type": "image",
      "service_version": "v1",
      "copyright": "Christian Bertincourt; \nText:\nKeighley Rockcliffe  \n(NASA\nGSFC, \nUMBC\nCSST, \nCRESST II)"
    }
  ]
}
```

### 9. Pagination (astroDaily exclusive)

Using the `page` to navigate across the pages of your query.

**Request:** `GET api/v1/apod?q=moon&media_type=video&limit=2&year=2026&page=5`

```json
{
  "meta": {
    "total": 714,
    "page": 5,
    "limit": 2,
    "total_pages": 357,
    "order": "desc",
    "query": "nebulae"
  },
  "results": [
    {
      "date": "2025-10-30",
      "title": "Lynds Dark Nebula 43",
      "explanation": "Sure, Halloween is an astronomy holiday. But astronomers always enjoy scanning the heavens for spook-tacular galaxies, stars, and nebulae. This favorite is item number 43 from the Beverly Lynds 1962 Catalog of Dark Nebulae, fondly known as the Cosmic Bat nebula. While its visage looks alarmingly like a scary flying mammal, Lynds Dark Nebula 43 is over 12 light-years across. Glowing with eerie light, stars are forming within the dusty interstellar molecular cloud that is dense enough to appear in silhouette against a luminous background of Milky Way stars. Watch out. This Cosmic Bat nebula is a mere 400 light-years distant toward the serpent-bearing constellation Ophiucus.",
      "url": "https://apod.nasa.gov/apod/image/2510/LDN43_CielAustral_1024.jpg",
      "hdurl": "https://apod.nasa.gov/apod/image/2510/LDN43_CielAustral_2000.jpg",
      "media_type": "image",
      "service_version": "v1",
      "copyright": "Team Ciel Austral"
    },
    {
      "date": "2025-10-23",
      "title": "SWAN, Swan, Eagle",
      "explanation": "Comet C/2025 R2 (SWAN) sports a greenish coma and fainter tail, seen against congeries of stars and dusty interstellar clouds in this 7 degree wide telescopic field of view from October 17. On that date, the new visitor to the inner Solar System obligingly posed with two other celestial birds seen toward the center of our Milky Way. Messier 16, near the bottom of the frame, and Messier 17 are also known to deep skywatchers as the Eagle and the Swan nebulae. While the comet coma's greenish glow recorded in the image is due to diatomic carbon gas fluorescing in sunlight, reddish hues seen in the nebulae, star forming regions some 5,000 light-years distant, are characteristic of ionized hydrogen gas. Comet SWAN is outbound now but still a good comet for binoculars and small telescopes that can look close to the southern horizon in the northern hemisphere's early evening skies. C/2025 R2 (SWAN) was closest to our fair planet on October 20, a mere 2.2 light-minutes away.",
      "url": "https://apod.nasa.gov/apod/image/2510/comet_Swan_with_eagle_20251017s1024.jpg",
      "hdurl": "https://apod.nasa.gov/apod/image/2510/comet_Swan_with_eagle_20251017s.jpg",
      "media_type": "image",
      "service_version": "v1",
      "copyright": "Adam Block"
    }
  ]
}
```

### 10. Chronology (astroDaily exclusive)

Using the `order` to control the chronology of the APODs returned.

**Request:** `GET api/v1/apod?q=nebulae&limit=2&order=asc`

```json
{
  "meta": {
    "total": 714,
    "page": 1,
    "limit": 2,
    "total_pages": 357,
    "order": "asc",
    "query": "nebulae"
  },
  "results": [
    {
      "date": "1995-06-28",
      "title": "The Cat's Eye Nebula",
      "explanation": "Today's Picture: June 28, 1995    The Cat's Eye Nebula  Picture Credit: NASA, Hubble Space Telescope  Explanation:  Three thousand light years away, a dying star throws off shells of glowing gas. This Hubble Space Telescope image reveals \"The Cat's Eye Nebula\" to be one of the most complex \"planetary nebulae\" known. In fact, the features seen in this image are so complex that astronomers suspect the visible central star may actually be a double star system. The term planetary nebula, used to describe this general class of objects, is misleading. Although these objects may appear round and planet-like in small telescopes, high resolution images reveal them to be stars surrounded by cocoons of gas blown off in the late stages of evolution.  Latest APOD Featuring this Image: July 4, 1996  For more information see NASA Space Telescope Scientific Institute press release.   We keep an archive of previous Astronomy Pictures of the Day.   Astronomy Picture of the Day is brought to you by  Robert Nemiroff and  Jerry Bonnell . Original material on this page is copyrighted to Robert J. Nemiroff and Jerry T. Bonnell.",
      "url": "https://apod.nasa.gov/apod/image/catseye.gif",
      "hdurl": "https://apod.nasa.gov/apod/image/catseye.gif",
      "media_type": "image",
      "service_version": "v1",
      "copyright": null
    },
    {
      "date": "1995-07-01",
      "title": "The Hooker Telescope on Mt. Wilson",
      "explanation": "July 1, 1995    The Hooker Telescope on Mt. Wilson  Picture Credit: Mount Wilson Observatory Explanation:  In the 1920s, pictures from the Hooker Telescope on Mt. Wilson fundamentally changed our understanding of the cosmos. Astronomer Edwin Hubble, using photographs he took with this telescope, demonstrated that the objects his contemporaries called \"spiral nebulae\" were actually huge systems of stars - spiral galaxies, similar to our own Milky Way galaxy but incredibly distant. Prior to Hubble's work it was argued that the spiral nebulae were mere clouds of gas and that they, along with everything else in the universe, were contained in our own galaxy. The Hooker Telescope mirror is 100 inches in diameter which is nearly the size of the mirror of the orbiting Hubble Space Telescope named in Hubble's honor. The Mount Wilson Observatory offers a \"virtual walking tour\" of this historic telescope.  For more information see Mount Wilson Observatory Historical Image Archives   We keep an archive of Astronomy Pictures of the Day.   Astronomy Picture of the Day is brought to you by  Robert Nemiroff and  Jerry Bonnell . Original material on this page is copyrighted to Robert J. Nemiroff and Jerry T. Bonnell.",
      "url": "https://apod.nasa.gov/apod/image/hooker.gif",
      "hdurl": "https://apod.nasa.gov/apod/image/hooker.gif",
      "media_type": "image",
      "service_version": "v1",
      "copyright": null
    }
  ]
}
```

### 11. Fields (astroDaily exclusive)

Using the `fields` to control the APOD attributes.

**Request:** `GET[ api/v1/apod?q=nebulae&order=asc&limit=2&fields=title`

```json
{
  "meta": {
    "total": 714,
    "page": 1,
    "limit": 2,
    "total_pages": 357,
    "order": "asc",
    "query": "nebulae"
  },
  "results": [
    { "date": "1995-06-28", "title": "The Cat's Eye Nebula" },
    { "date": "1995-07-01", "title": "The Hooker Telescope on Mt. Wilson" }
  ]
}
```
