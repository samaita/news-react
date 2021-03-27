# News React
A news app make in React with React Hook(love this!). You can rename the brand with other name for your liking.

![Samaita-News-React](https://user-images.githubusercontent.com/6941042/112710995-c0f0b980-8ef7-11eb-8197-24fc586c6e5a.jpeg)

# Live Demo
You can access the **[Github Pages for News API](https://samaita.github.io/news-react/)**. If you want to see the APP with News API, there are several steps you need to do:
1. Since we are using CORS Proxy, please access [CORS Proxy by Rob--W](https://cors-anywhere.herokuapp.com/) and enable it first.
2. **Precaution**, the API could still fail due to Cloudflare Captcha for CORS Proxy, so make sure your browser's cookie enabled.

# How To Run for devel
There are two way to run this app: Dynamic & Mock.
After run `npm install` you may choose to run as Dynamic or stay in Mock mode.

## Running as Dynamic
We are using News API as data source.
1. Please register your own account at **[News API](https://newsapi.org/)**
2. Get your own API Key, copy it
3. Back to the repositoy, you will find a file named `.env.sample`
4. Replace `YOUR_OWN_KEY` with your own copied key
5. Rename the `,env.sample` with `.env`
6. Run `npm run start`

## Running as Mock
Much simpler, offline data source
1. Run `npm run start`
2. !@#ED@!#
3. Profit

# Features
- **Bookmark**, for your avid reader that want to read it all but later, or never. Stored in localStorage!
- **Share**, quickly share an interesting story about tech. Well.. might not as fun as sharing funny meme or cat photos
- **Mock Data Switch**, for developer!
- **Extensive Category** from Space to Health, you can add more simply by adding new category & it keyword.
- **Trending**, quick access for the popular article. For enthusiast reader and those who FOMO
- **Dark Mode**, well actually not a feature but yeah we theme it in dark

# Disclaimer
Lampu Neon is not a sub-niche or related to any Online Media. The brand is a completely made up name, and no, we are not affiliated with the Indonesia's newspaper legend: Lampu Merah & Lampu Hijau 😆
