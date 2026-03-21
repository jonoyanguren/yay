/**
 * Inline styles shared across transactional emails (Resend / HTML).
 * Keep in sync when adjusting visual language.
 */
export const emailLayoutStyles = {
  body:
    "margin: 0; padding: 0; background-color: #f5f5f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;",
  outerWrap: "background-color: #f5f5f5; padding: 40px 20px;",
  card:
    "background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);",
  headerGreen:
    "background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 30px; text-align: center;",
  headerTitle: "margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;",
  headerSubtitle: "margin: 10px 0 0 0; color: rgba(255,255,255,0.9); font-size: 16px;",
  contentCell: "padding: 40px 30px;",
  paragraph:
    "margin: 0 0 20px 0; font-size: 16px; color: #333; line-height: 1.6;",
  paragraphLast:
    "margin: 0 0 30px 0; font-size: 16px; color: #333; line-height: 1.6;",
  mutedParagraph:
    "margin: 0 0 20px 0; font-size: 14px; color: #6b7280; line-height: 1.6;",
  sectionBox:
    "background-color: #f9fafb; border-radius: 8px; border: 1px solid #e5e7eb; margin-bottom: 30px;",
  sectionBoxInner: "padding: 24px;",
  sectionHeading:
    "margin: 0 0 16px 0; font-size: 18px; color: #111; font-weight: 600;",
  infoBoxBlue:
    "background-color: #eff6ff; border-radius: 8px; border-left: 4px solid #3b82f6; margin-bottom: 30px;",
  infoBoxBlueInner: "padding: 16px 20px;",
  infoBoxBlueText: "margin: 0; font-size: 14px; color: #1e40af; line-height: 1.5;",
  noticeBoxAmber:
    "background-color: #fffbeb; border-radius: 8px; border-left: 4px solid #f59e0b; margin-bottom: 30px;",
  noticeBoxAmberInner: "padding: 16px 20px;",
  ctaWrap: "margin-top: 30px;",
  ctaButton:
    "display: inline-block; background-color: #10b981; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px;",
  footer:
    "background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;",
  footerLine: "margin: 0 0 8px 0; font-size: 14px; color: #6b7280;",
  footerMeta: "margin: 0; font-size: 12px; color: #9ca3af;",
  retreatCardLink: "text-decoration: none; color: #111;",
  retreatCardImage:
    "width: 100%; max-width: 520px; height: auto; border-radius: 8px; display: block; margin: 0 auto 12px auto; border: 1px solid #e5e7eb;",
  retreatCardTitle:
    "margin: 0 0 24px 0; font-size: 16px; font-weight: 600; color: #111; text-align: center; line-height: 1.4;",
} as const;
