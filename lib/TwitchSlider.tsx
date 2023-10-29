import React, { useEffect, useMemo, useRef, useState } from 'react';

export type TwitchSliderProps = {
  autoPlay: boolean;
  centerSlideClassName?: string;
  centerSlideStyle?: React.CSSProperties;
  children: React.ReactElement[];
  initialCenterSlideIndex: number;
  interval: number;
  nextButtonClassName?: string;
  nextButtonContent: React.ReactNode;
  pauseOnHover: false | 'centerSlide' | 'allSlides' | 'wrapper';
  prevButtonClassName?: string;
  prevButtonContent: React.ReactNode;
  side1SlidesClassName?: string;
  side1SlidesScale: string;
  side1SlidesStyle?: React.CSSProperties;
  side1SlidesTranslateX?: string;
  side2SlidesClassName?: string;
  side2SlidesScale: string;
  side2SlidesStyle?: React.CSSProperties;
  side2SlidesTranslateX?: string;
  slideHeight: number | string;
  slideWidth: number | string;
};

export default function TwitchSlider(props: TwitchSliderProps) {
  const {
    autoPlay,
    centerSlideClassName,
    centerSlideStyle,
    children,
    initialCenterSlideIndex,
    interval,
    nextButtonClassName,
    nextButtonContent,
    pauseOnHover,
    prevButtonClassName,
    prevButtonContent,
    side1SlidesClassName,
    side1SlidesScale,
    side1SlidesStyle,
    side2SlidesTranslateX,
    side2SlidesClassName,
    side2SlidesScale,
    side2SlidesStyle,
    side1SlidesTranslateX,
    slideHeight,
    slideWidth
  } = props;

  const intervalRef = useRef<number | null>(null);

  const cancelInterval = () => {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
    }
  };

  const createInterval = () => {
    intervalRef.current = window.setInterval(() => {
      setStartIndex((index) => (index + 1) % children.length);
    }, interval * 1000);
  };

  const wrapperStyle = {
    '--slide-width': slideWidth,
    '--slide-height': slideHeight,
    position: 'relative',
  } as React.CSSProperties;

  const [startIndex, setStartIndex] = useState(initialCenterSlideIndex + children.length - 3);

  const visibleIndexes = useMemo(() => {
    const indexes = [];
    for (let i = 0; i < 7; i++) {
      indexes.push((i + startIndex) % children.length);
    }
    return indexes;
  }, [children.length, startIndex]);

  const slides = [];

  for (let i = 0; i < children.length; i++) {
    let style = {
      height: 'var(--slide-height)',
      left: 'calc(50% - var(--slide-width) / 2)',
      opacity: 0,
      position: 'absolute',
      width: 'var(--slide-width)',
      zIndex: 0
    } as React.CSSProperties;

    const slideClassNames = [
      'rts-slide-visible'
    ];

    if (visibleIndexes.includes(i)) {
      style.opacity = 1;
      style.transition = 'all 100ms ease-in-out';
    }

    const slideNumber = visibleIndexes.indexOf(i);

    if (slideNumber > -1) {
      if ([0, 1, 5, 6].includes(slideNumber)) {
        if (slideNumber === 0 || slideNumber === 6) {
          style.zIndex = 1;
        } else {
          style.zIndex = 2;
        }
        if (slideNumber === 0 || slideNumber === 1) {
          style.transform = `scale(${side2SlidesScale}) translateX(-${side2SlidesTranslateX})`;
        } else {
          style.transform = `scale(${side2SlidesScale}) translateX(${side2SlidesTranslateX})`;
        }
        slideClassNames.push('rts-slide-side2');
        if (side2SlidesClassName) {
          slideClassNames.push(side2SlidesClassName);
        }
        if (side2SlidesStyle) {
          style = {
            ...style,
            ...side2SlidesStyle
          };
        }
      }

      if ([2, 4].includes(slideNumber)) {
        style.zIndex = 3;
        if (slideNumber === 2) {
          style.transform = `scale(${side1SlidesScale}) translateX(-${side1SlidesTranslateX})`;
        } else {
          style.transform = `scale(${side1SlidesScale}) translateX(${side1SlidesTranslateX})`;
        }
        slideClassNames.push('rts-slide-side1');
        if (side1SlidesClassName) {
          slideClassNames.push(side1SlidesClassName);
        }
        if (side1SlidesStyle) {
          style = {
            ...style,
            ...side1SlidesStyle
          };
        }
      }

      if (slideNumber === 3) {
        style.zIndex = 4;
        slideClassNames.push('rts-slide-center');
        if (centerSlideClassName) {
          slideClassNames.push(centerSlideClassName);
        }
        if (centerSlideStyle) {
          style = {
            ...style,
            ...centerSlideStyle
          };
        }
      }
    }

    slides.push(
      <div
        key={i}
        className={slideClassNames.join(' ')}
        onMouseEnter={autoPlay && ((pauseOnHover === 'centerSlide' && slideNumber === 3) || pauseOnHover === 'allSlides') ? cancelInterval : undefined}
        onMouseLeave={autoPlay && ((pauseOnHover === 'centerSlide' && slideNumber === 3) || pauseOnHover === 'allSlides') ? createInterval : undefined}
        style={style}
      >
        {children[i]}
      </div>
    );
  }

  useEffect(() => {
    if (autoPlay) {
      intervalRef.current = window.setInterval(() => {
        setStartIndex((index) => (index + 1) % children.length);
      }, interval * 1000);

      return () => {
        if (intervalRef.current) {
          window.clearInterval(intervalRef.current);
        }
      };
    }
  }, [autoPlay, children.length, interval]);

  const handleNext = () => {
    setStartIndex((index) => (index + 1) % children.length);

    if (autoPlay) {
      cancelInterval();
      createInterval();
    }
  };

  const handlePrev = () => {
    setStartIndex((index) => (index > 0 ? index - 1 : children.length - 1));

    if (autoPlay) {
      cancelInterval();
      createInterval();
    }
  };

  return (
    <div
      onMouseEnter={autoPlay && pauseOnHover === 'wrapper' ? cancelInterval : undefined}
      onMouseLeave={autoPlay && pauseOnHover === 'wrapper' ? createInterval : undefined}
      style={wrapperStyle}
    >
      <div
        style={{
          position: 'relative',
          height: 'var(--slide-height)'
        }}
      >
        {slides}
      </div>

      <button
        className={nextButtonClassName}
        onClick={handleNext}
        style={{
          position: 'absolute',
          right: 0,
          top: '50%',
          transform: 'translateY(-50%)'
        }}
      >
        {nextButtonContent}
      </button>

      <button
        className={prevButtonClassName}
        onClick={handlePrev} 
        style={{
          position: 'absolute',
          left: 0,
          top: '50%',
          transform: 'translateY(-50%)'
        }}
      >
        {prevButtonContent}
      </button>
    </div>
  );
}

TwitchSlider.defaultProps = {
  autoPlay: true,
  initialCenterSlideIndex: 0,
  interval: 5,
  nextButtonContent: '>>',
  pauseOnHover: 'centerSlide',
  prevButtonContent: '<<',
  side1SlidesScale: '0.8',
  side1SlidesTranslateX: '40%',
  side2SlidesScale: '0.65',
  side2SlidesTranslateX: '80%',
};
