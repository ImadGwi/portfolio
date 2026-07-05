// src/components/main/StacksSection.jsx
import ScrollFloat from '@/components/motion/ScrollFloat';
import TerminalCard from '@/components/main/TerminalCard';
import { getStacks } from './mainApi';

export default async function StacksSection() {
  const { stacks } = await getStacks();
  // console.log(stacks);


  return (
    <section className="px-6 py-20" id='stacks'>
      <div className="max-w-6xl mx-auto">
        <p className="text-xs tracking-widest mb-8" style={{ color: 'var(--chrome)' }}>
          [ STACK ] — {stacks?.length ?? 0}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {stacks?.map((stack) => (

            <TerminalCard stack={stack} key={stack.id} />
          ))}
        </div>
      </div>
    </section>
  );
}