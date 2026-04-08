/**
 * Inline styles shared across transactional emails (Resend / HTML).
 * Keep in sync when adjusting visual language.
 */
export const emailLayoutStyles = {
  body:
    "margin: 0; padding: 0; background-color: #ffffff; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;",
  outerWrap: "background-color: #ffffff; padding: 40px 20px;",
  card:
    "background-color: #fffcf3; border-radius: 18px; overflow: hidden; border: 1px solid #f3e6d4;",
  headerGreen:
    "background-color: #301e0e; height: 467px; padding: 40px 30px; text-align: center;",
  /** Slightly brighter gradient for celebration / full-payment emails */
  headerCelebration:
    "background-color: #301e0e; height: 467px; padding: 40px 30px; text-align: center;",
  headerTitle:
    "margin: 0; color: #fffcf3; font-size: 28px; line-height: 1.2; font-weight: 600; font-family: 'Trebuchet MS', Avenir, 'Helvetica Neue', Helvetica, Arial, sans-serif;",
  headerSubtitle:
    "margin: 10px 0 0 0; color: #fffcf3; opacity: 0.9; font-size: 16px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;",
  contentCell: "padding: 40px 30px;",
  paragraph:
    "margin: 0 0 20px 0; font-size: 16px; color: #301e0e; line-height: 1.6;",
  paragraphLast:
    "margin: 0 0 30px 0; font-size: 16px; color: #301e0e; line-height: 1.6;",
  mutedParagraph:
    "margin: 0 0 20px 0; font-size: 14px; color: #583813; line-height: 1.6;",
  sectionBox:
    "background-color: #ffffff; border-radius: 12px; border: 1px solid #f3e6d4; margin-bottom: 30px;",
  sectionBoxInner: "padding: 24px;",
  sectionHeading:
    "margin: 0 0 16px 0; font-size: 18px; color: #301e0e; font-weight: 600; font-family: 'Trebuchet MS', Avenir, 'Helvetica Neue', Helvetica, Arial, sans-serif;",
  infoBoxBlue:
    "background-color: #ffffff; border-radius: 12px; border-left: 4px solid #f9b3ac; border: 1px solid #f3e6d4; margin-bottom: 30px;",
  infoBoxBlueInner: "padding: 16px 20px;",
  infoBoxBlueText: "margin: 0; font-size: 14px; color: #301e0e; line-height: 1.6;",
  noticeBoxAmber:
    "background-color: #ffffff; border-radius: 12px; border-left: 4px solid #e0e49a; border: 1px solid #f3e6d4; margin-bottom: 30px;",
  noticeBoxAmberInner: "padding: 16px 20px;",
  ctaWrap: "margin-top: 30px;",
  ctaButton:
    "display: inline-block; background-color: #301e0e; color: #fffcf3; text-decoration: none; padding: 14px 32px; border-radius: 999px; font-weight: 600; font-size: 16px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;",
  footer:
    "background-color: #fff8e8; padding: 30px; text-align: center; border-top: 1px solid #f3e6d4;",
  footerLine: "margin: 0 0 8px 0; font-size: 14px; color: #301e0e;",
  footerMeta: "margin: 0; font-size: 12px; color: #583813;",
  retreatCardLink: "text-decoration: none; color: #301e0e;",
  retreatCardImage:
    "width: 100%; max-width: 520px; height: auto; border-radius: 12px; display: block; margin: 0 auto 12px auto; border: 1px solid #f3e6d4;",
  retreatCardTitle:
    "margin: 0 0 24px 0; font-size: 16px; font-weight: 600; color: #301e0e; text-align: center; line-height: 1.4; font-family: 'Trebuchet MS', Avenir, 'Helvetica Neue', Helvetica, Arial, sans-serif;",
} as const;
