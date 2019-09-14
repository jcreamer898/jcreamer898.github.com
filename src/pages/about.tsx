import { css } from '@emotion/core';
import * as React from 'react';
import Helmet from 'react-helmet';
import Footer from '../components/Footer';
import SiteNav from '../components/header/SiteNav';
import { PostFullContent } from '../components/PostContent';
import Wrapper from '../components/Wrapper';
import IndexLayout from '../layouts';
import { inner, outer, SiteHeader, SiteMain } from '../styles/shared';
import { NoImage, PostFull, PostFullHeader, PostFullTitle } from '../templates/post';


const PageTemplate = css`
  .site-main {
    background: #fff;
    padding-bottom: 4vw;
  }
`;

const About: React.FC = () => (
  <IndexLayout>
    <Helmet>
      <title>About</title>
    </Helmet>
    <Wrapper css={PageTemplate}>
      <header css={[outer, SiteHeader]}>
        <div css={inner}>
          <SiteNav />
        </div>
      </header>
      <main id="site-main" className="site-main" css={[SiteMain, outer]}>
        <article className="post page" css={[PostFull, NoImage]}>
          <PostFullHeader>
            <PostFullTitle>About</PostFullTitle>
          </PostFullHeader>

          <PostFullContent className="post-full-content">
            <div className="post-content">
              <p>
                JavaScript and front end technologies are my passion. I also believe that you cannot ever stop learning which is why I stay active in the development community attending user groups like <a href="http://nashjs.org">http://nashjs.org</a>, and NashDotNet, blogging on <a href="http://jonathancreamer.com">http://jonathancreamer.com</a>, Net Tuts, and Smashing Magazine, tweeting at <a href="https://twitter.com/jcreamer898">jcreamer898</a> and scouring the internet for as much knowledge I can squeeze into my brain.
              </p>
              <p>
                I work as a Senior Engineer at Eventbrite. I love meeting other devs who are passionate about what they do.
              </p>
            </div>
          </PostFullContent>
        </article>
      </main>
      <Footer />
    </Wrapper>
  </IndexLayout>
);

export default About;
