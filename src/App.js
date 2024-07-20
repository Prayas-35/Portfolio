import Navbar from './components/Navbar';
import 'animate.css';
import { useInView } from 'react-intersection-observer';
import TypedAnimation from './components/TypedAnimation';

export default function App() {
  const [ref1, inView1] = useInView({ triggerOnce: false });
  const [ref2, inView2] = useInView({ triggerOnce: false });

  return (
    <div className='text-foreground bg-background'>
      <div className='mx-auto max-w-[81rem]'>
        <Navbar />
        <main>
          <section ref={ref1} className='max-h-fit min-h-screen'>
            <h1 className={`text-2xl sm:text-3xl font-bold underline bg-background text-foreground ${inView1 ? 'animate__animated animate__fadeInLeft' : ''}`}>
              <TypedAnimation />
            </h1>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequuntur, ullam optio reiciendis eveniet a rem ipsam, error tempora voluptate in incidunt. Distinctio quae maiores perferendis earum incidunt reprehenderit! Dolorem, quasi.
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Maiores architecto error totam omnis id voluptate, numquam temporibus, magnam, doloribus ut enim. Sit doloremque repellendus maxime tenetur totam amet harum saepe?
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem cum facilis facere eum quidem corporis voluptatum veniam voluptates maxime minima porro aspernatur neque, recusandae vel saepe commodi accusantium inventore nam!
          </section>
          <section id='projects' ref={ref2} className='h-screen'>
            <h1 className={`text-foreground ${inView2 ? 'animate__animated animate__fadeInLeft' : ''}`}>
              Hello world2!
            </h1>
          </section>
        </main>
      </div>
    </div>
  );
}
