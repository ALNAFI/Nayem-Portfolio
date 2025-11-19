import { Button } from '~/components/button';
import { DecoderText } from '~/components/decoder-text';
import { Divider } from '~/components/divider';
import { Footer } from '~/components/footer';
import { Heading } from '~/components/heading';
import { Icon } from '~/components/icon';
import { Input } from '~/components/input';
import { Section } from '~/components/section';
import { tokens } from '~/components/theme-provider/theme';
import { Transition } from '~/components/transition';
import { Text } from '~/components/text';
import { useFormInput } from '~/hooks';
import { cssProps, msToNum, numToMs } from '~/utils/style';
import { baseMeta } from '~/utils/meta';
import { useState } from 'react';
import styles from './contact.module.css';


export const meta = () => {
  return baseMeta({
    title: 'Contact',
    description:
      'Send me a message if you’re interested in discussing a project or if you just want to say hi',
  });
};

export const Contact = () => {
  const [result, setResult] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const email = useFormInput('');
  const message = useFormInput('');
  const initDelay = tokens.base.durationS;
  const contactLinks = [
    {
      label: 'Facebook',
      icon: 'facebook',
      href: 'https://www.facebook.com/nayem55480',
    },
    {
      label: 'Email',
      icon: 'mail',
      href: 'mailto:eng.m.nayem@gmail.com',
    },
    {
      label: 'GitHub',
      icon: 'github',
      href: 'https://github.com/NAYEM-MD',
    },
    {
      label: 'LINE',
      icon: 'line',
      href: 'https://line.me/ti/p/eCnPGd1bmL',
    },
    {
      label: 'WhatsApp',
      icon: 'whatsapp',
      href: 'https://wa.me/819038518007',
    },
    {
      label: 'Phone',
      icon: 'phone',
      href: 'tel:+819038518007',
    },
  ];

  const onSubmit = async (event) => {
    event.preventDefault();
    
    // Prevent multiple submissions
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    setResult('Sending....');

    const formData = new FormData(event.target);
    formData.append('access_key', '8cdb4de4-fa95-4680-8ae5-32d45a51a217');

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setResult('');
        setShowPopup(true);
        event.target.reset();
        // Clear controlled inputs
        email.onChange({ target: { value: '' } });
        message.onChange({ target: { value: '' } });
        // Auto-hide popup after 3 seconds
        setTimeout(() => {
          setShowPopup(false);
        }, 3000);
      } else {
        setResult('Error');
      }
    } catch (error) {
      setResult('Error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Section className={styles.contact}>
      <Transition unmount={false} in={true} timeout={1600}>
        {({ status, nodeRef }) => (
          <form
            className={styles.form}
            ref={nodeRef}
            onSubmit={onSubmit}
          >
            <Heading
              className={styles.title}
              data-status={status}
              level={3}
              as="h1"
              style={getDelay(tokens.base.durationXS, initDelay, 0.3)}
            >
              <DecoderText text="Say hello" start={status !== 'exited'} delay={300} />
            </Heading>
            <Divider
              className={styles.divider}
              data-status={status}
              style={getDelay(tokens.base.durationXS, initDelay, 0.4)}
            />
            <Input
              className={styles.input}
              data-status={status}
              style={getDelay(tokens.base.durationXS, initDelay)}
              autoComplete="email"
              label="Your email"
              type="email"
              name="email"
              required
              {...email}
            />
            <Input
              multiline
              className={styles.input}
              data-status={status}
              style={getDelay(tokens.base.durationS, initDelay)}
              autoComplete="off"
              label="Message"
              name="message"
              required
              {...message}
            />
            {result && (
              <Text className={styles.result} size="m" as="p" data-status={status}>
                {result}
              </Text>
            )}
            <Button
              className={styles.button}
              data-status={status}
              style={getDelay(tokens.base.durationM, initDelay)}
              icon="send"
              type="submit"
              disabled={isSubmitting}
              loading={isSubmitting}
              loadingText="Sending..."
            >
              Send message
            </Button>
            <ul
              className={styles.socialLinks}
              data-status={status}
              style={getDelay(tokens.base.durationM, initDelay, 1.4)}
            >
              {contactLinks.map((link) => {
                const isExternal = link.href.startsWith('http');

                return (
                  <li key={link.label}>
                    <a
                      className={styles.socialLink}
                      href={link.href}
                      target={isExternal ? '_blank' : undefined}
                      rel={isExternal ? 'noreferrer' : undefined}
                      aria-label={link.label}
                    >
                      <Icon
                        className={styles.socialIcon}
                        icon={link.icon}
                        size={28}
                      />
                    </a>
                  </li>
                );
              })}
            </ul>
            {/* Hidden name field for Web3Forms */}
            <input type="text" name="name" style={{ display: 'none' }} />
          </form>
        )}
      </Transition>
      <Transition unmount in={showPopup} timeout={300}>
        {({ status, nodeRef }) => (
          <div 
            className={styles.popupOverlay} 
            ref={nodeRef} 
            data-status={status}
            onClick={() => setShowPopup(false)}
          >
            <div 
              className={styles.popup}
              onClick={(e) => e.stopPropagation()}
            >
              <Text size="l" as="p" className={styles.popupText}>
                Form Submitted Successfully
              </Text>
              <Button
                className={styles.popupClose}
                onClick={() => setShowPopup(false)}
                icon="close"
                iconOnly
              />
            </div>
          </div>
        )}
      </Transition>
      <Footer className={styles.footer} />
    </Section>
  );
};

function getDelay(delayMs, offset = numToMs(0), multiplier = 1) {
  const numDelay = msToNum(delayMs) * multiplier;
  return cssProps({ delay: numToMs((msToNum(offset) + numDelay).toFixed(0)) });
}
