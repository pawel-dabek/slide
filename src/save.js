/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps, RichText } from '@wordpress/block-editor';

/**
 * The save function defines the way in which the different attributes should
 * be combined into the final markup, which is then serialized by the block
 * editor into `post_content`.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#save
 *
 * @return {Element} Element to render.
 */
export default function save({ attributes }) {
  const { title, text, buttons, image, showTitle, showText, showImage } = attributes;
  return (
    <div {...useBlockProps.save({ className: 'slide-card swiper-slide' })}>
      {showImage && image.url && (
        <div class="slide-card__image">
          <img src={image.url} loading="lazy" alt={image.alt} srcSet={image.srcSet} sizes="50vw" />
        </div>
      )}
      <div class="slide-card__content">
        {showTitle && <RichText.Content tagName="h1" className="slide-card__title" value={title} />}
        {showText && <RichText.Content tagName="p" className="slide-card__text" value={text} />}
        <div class="slide-card__buttons">
          {buttons.map((button, index) =>
            button.show ? (
              <a key={index} href={button.url} className={`button ${button.style}`}>
                {button.text}
              </a>
            ) : null,
          )}
        </div>
      </div>
    </div>
  );
}
