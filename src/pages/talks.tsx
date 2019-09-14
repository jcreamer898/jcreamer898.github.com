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

const Talks: React.FC = () => (
  <IndexLayout>
    <Helmet>
      <title>Talks</title>
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
            <PostFullTitle>Talks</PostFullTitle>
          </PostFullHeader>

          <PostFullContent className="post-full-content">
            <div className="post-content">
              <p>
                <h3>Deep Dive Into the React Lifecycle - Fluent Conf 2017</h3>
                <iframe width="560" height="315" src="https://www.youtube.com/embed/7PpEQMdBIF0" frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
              </p>
              <p>
                <h3>JavaScript Architecture of the 23rd Century - Code on the Beach 2015</h3>
                <iframe width="560" height="315" src="https://www.youtube.com/embed/HISiMKmYR_w" frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
              </p>
              <p>
                <h3>Advanced WebPack - Nodevember 2015</h3>
                <iframe width="560" height="315" src="https://www.youtube.com/embed/MzVFrIAwwS8" frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
              </p>
              <p>
                <h3>Advanced WebPack - Code on the Beach 2016</h3>
                <iframe width="560" height="315" src="https://www.youtube.com/embed/7PpEQMdBIF0" frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
              </p>
              <p>
                  <h3>Why would you NOT choose TypeScript?!</h3>
                  <a href="https://www.recallact.com/presentation/why-would-you-not-choose-typescript">Watch here.</a>

              </p>
            </div>
          </PostFullContent>
        </article>
      </main>
      <Footer />
    </Wrapper>
  </IndexLayout>
);

export default Talks;
