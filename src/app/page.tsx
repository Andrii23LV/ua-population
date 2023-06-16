import React from "react";

export const metadata = {
  title: 'Ukraine population',
  description: 'Check the change in the population of Ukraine'
}

const Home = () => {
  return (
    <section className="w-full flex-center flex-col">
      <h1 className="head_text pt-20">
        Discover the change
        <br className="max-md" />
        <span className="purple_gradient">in the population of Ukraine.</span>
      </h1>
      <p className="desc mt-2">
        Most of the information from the last twenty years is taken from official state sources.
      </p>
      <div className="w-5/6 flex flex-center flex-col border-t-2 align-center mt-12 mb-8 pt-8">
        <div className="flex flex-col items-center">
          <p className="head_text">37,6 М</p>
          <p>As of the beginning of 2022</p>
        </div>
        <div className="flex flex-col items-center">
          <p className="head_text text-rose-500">-</p>
          <p className="head_text text-rose-500">20,7 М</p>
        </div>
        <div className="flex flex-col items-center">
          <p>left Ukraine since 24.02.2022</p>
          <p className="head_text text-green-500">+</p>
        </div>
        <div className="flex flex-col items-center">
          <p className="head_text text-green-500">12,1 М</p>
          <p>returned to Ukraine</p>
        </div>
      </div>
      <p className="w-5/6 text-justify">The population of Ukraine on 05/04/2023 is approximately <span className="blue_gradient pr-1">29,000,000.</span>
        Since the beginning of the full-scale war on February 24, 2022, approximately 2,070,000 people have left the territory of Ukraine.
        In turn, approximately 12,100,000 people have returned since then.
        Total population estimates are based on the total population as of early 2022, which is approximately 37.6 million people.
        The economically active population is currently 12 million people.</p>
    </section>
  );
};

export default Home;
