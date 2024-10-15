/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps, RichText, InspectorControls, MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { PanelBody, ToggleControl, TextControl, SelectControl, Button } from '@wordpress/components';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {Element} Element to render.
 */
export default function Edit({ attributes, setAttributes }) {
  const { title, text, buttons, image, showTitle, showText, showImage } = attributes;

  const toggleAttribute = (attributeName) => setAttributes({ [attributeName]: !attributes[attributeName] });

  const updateButtonAttribute = (index, key, value) => {
    const updatedButtons = [...buttons];
    updatedButtons[index] = { ...updatedButtons[index], [key]: value };
    setAttributes({ buttons: updatedButtons });
  };

  return (
    <>
      <InspectorControls>
        <PanelBody title={__('Ustawienia bloku', 'slide')}>
          <ToggleControl checked={!!showTitle} label={__('Włącz tytuł', 'slide')} onChange={() => toggleAttribute('showTitle')} />
          <ToggleControl checked={!!showText} label={__('Włącz opis', 'slide')} onChange={() => toggleAttribute('showText')} />
          {buttons.map((button, index) => (
            <>
              <ToggleControl checked={!!button.show} label={__('Włącz przycisk ') + (index + 1)} onChange={() => updateButtonAttribute(index, 'show', !button.show)} />
              {button.show && (
                <>
                  <div className="button-content-inputs">
                    <TextControl label={__('Tekst przycisku', 'slide')} value={button.text} onChange={(value) => updateButtonAttribute(index, 'text', value)} />
                    <TextControl label={__('URL przycisku', 'slide')} value={button.url} onChange={(value) => updateButtonAttribute(index, 'url', value)} />
                  </div>
                  <SelectControl
                    label={__('Styl przycisku', 'slide')}
                    value={button.style}
                    options={[
                      { label: 'Wypełnienie', value: 'button--full' },
                      { label: 'Obramówka', value: 'button--border' },
                      { label: 'Tekst', value: 'button--text' },
                    ]}
                    onChange={(value) => updateButtonAttribute(index, 'style', value)}
                  />
                </>
              )}
            </>
          ))}
        </PanelBody>
      </InspectorControls>
      <div {...useBlockProps({ className: 'slide-card swiper-slide' })}>
        <div className="slide-card__image">
          <MediaUploadCheck>
            <MediaUpload
              onSelect={(media) => {
                const srcSet = media.sizes
                  ? Object.values(media.sizes)
                      .map((size) => `${size.url} ${size.width}w`)
                      .join(', ')
                  : '';

                setAttributes({
                  image: {
                    id: media.id,
                    url: media.url,
                    alt: media.alt || '',
                    srcSet: srcSet,
                  },
                });
              }}
              value={image.id}
              render={({ open }) => <Button onClick={open} className="image-selector-button"></Button>}
            />
          </MediaUploadCheck>
          {showImage && image.url && <img src={image.url} alt={image.alt} loading="lazy" srcSet={image.srcSet} sizes="50vw" />}
        </div>
        <div className="slide-card__content">
          {showTitle && <RichText tagName="h1" className="slide-card__title" value={title} onChange={(value) => setAttributes({ title: value })} placeholder="Wpisz tytuł tutaj..." />}
          {showText && <RichText tagName="p" className="slide-card__text" value={text} onChange={(value) => setAttributes({ text: value })} placeholder="Wpisz opis tutaj..." />}
          <div className="slide-card__buttons">
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
    </>
  );
}
