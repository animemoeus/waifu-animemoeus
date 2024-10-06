'use client'
import { DiscussionEmbed } from "disqus-react";

export default function Disqus(props) {
  const disqusConfig = {
    url: `https://waifu.animemoe.us/${props.data.image_id}`,
    identifier: props.data.image_id, // Single post id
    title: `${props.data.image_id} | AnimeMoeUs`, // Single post title
  };

  return <DiscussionEmbed shortname="waifu-animemoeus" config={disqusConfig} />;
}
