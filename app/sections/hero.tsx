import { createSchema, type HydrogenComponentProps } from "@weaverse/hydrogen";
import { forwardRef } from "react";

interface HeroProps extends HydrogenComponentProps { heading: string }

const Hero = forwardRef<HTMLElement, HeroProps>((props, ref) => {
  const { heading, ...rest } = props;
  return (
    <section ref={ref} {...rest} className="py-16 text-center">
      <h1 className="text-4xl font-bold">{heading}</h1>
    </section>
  );
});

export default Hero;

export const schema = createSchema({
  type: "hero",
  title: "Hero",
  settings: [
    {
      group: "Content",
      inputs: [
        { type: "text", name: "heading", label: "Heading", defaultValue: "Welcome" },
      ],
    },
  ],
});