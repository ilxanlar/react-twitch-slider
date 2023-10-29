import TwitchSlider from '../'
import classes from './App.module.css'

const images = [
  { key: 0, color: 'red' },
  { key: 1, color: 'orange' },
  { key: 2, color: 'lightblue' },
  { key: 3, color: 'green' },
  { key: 4, color: 'blue' },
  { key: 5, color: 'purple' },
  { key: 6, color: 'indigo' },
  { key: 7, color: 'orangered' },
  { key: 8, color: 'gray' },
  { key: 9, color: 'black' },
].map(item => ({
  ...item,
  url: `https://picsum.photos/seed/random-${Math.random()}/600/400`
}));

export default function App() {
  return (
    <div style={{ margin: '25vh 0' }}>
      <TwitchSlider
        nextButtonClassName={classes.nextButton}
        nextButtonContent=">"
        prevButtonClassName={classes.prevButton}
        prevButtonContent="<"
        // side2SlidesClassName={classes.side2Slides}
        // side1SlidesClassName={classes.side1Slides}
        // centerSlideClassName={classes.centerSlide}
        slideHeight="50vh"
        slideWidth="75vh"
      >
        {images.map(image => (
          <div className={classes.slide}>
            <img src={image.url} />
          </div>
        ))}
      </TwitchSlider>
    </div>
  )
}
