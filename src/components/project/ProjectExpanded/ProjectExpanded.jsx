import React from 'react'
import Layout from '../../global/Layout'
import Banner from '../Banner'
import CallToAction from '../CallToAction'
import Faq from '../Faq'
import Mint from '../Mint'
import Roadmap from '../Roadmap'
import Showcase from '../Showcase'

const ProjectExpanded = ({ data, pageLocation }) => {
  return (
    <Layout
      footer={{ fillBackground: true, absolutelyPositioned: false }}
      theme="blue"
      pageLocation={pageLocation}
    >
      <Banner
        image={data.project.expanded.banner.backgroundImage}
        status={data.project.status}
        title={data.title}
        launchDate={data.project.launchDate}
        shortDescription={data.project.shortDescription}
        socials={data.project.expanded.socials}
      />
      <div className="absolute inset-0 -left-px bottom-0 z-[-1] bg-repeat new-mint-bg" />
      <div className="container py-10 lg:py-20 grid lg:grid-cols-2 gap-y-16 gap-x-32">
        <div>
          <Roadmap milestones={data.project.expanded.roadmap.milestones} />
        </div>
        <div className="flex items-center">
          <Mint {...data.project.mint} />
        </div>
      </div>
      <Showcase
        images={data.project.expanded.nftShowcase.gallery}
        subtitle={data.project.expanded.nftShowcase.subtitle}
        title={data.project.expanded.nftShowcase.title}
        description={data.project.expanded.nftShowcase.description}
      />
      <Faq {...data.project.expanded.faq} />
      <CallToAction />
    </Layout>
  )
}

export default ProjectExpanded
