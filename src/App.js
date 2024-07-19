import Navbar from './components/Navbar';

export default function App() {
  return (
    <div className='text-foreground bg-background'>
      <div className='mx-auto max-w-[81rem]'>
        <Navbar />
        <h1 className="text-3xl font-bold underline bg-background text-foreground">
          Hello world!
        </h1>
      </div>
    </div>
  )
}