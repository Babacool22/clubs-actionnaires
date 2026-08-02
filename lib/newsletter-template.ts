export const CLUBS_ACTIONNAIRES_WEEKLY_TEMPLATE = `<!doctype html>
<html lang="fr">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>[[TITRE_DE_LA_NEWSLETTER]]</title>
  </head>
  <body style="margin:0;padding:0;background:#ececeb;color:#171717;">
    <!--
      MODE D'EMPLOI
      1. Remplace chaque texte entre doubles crochets [[...]].
      2. Pour chaque bouton, remplace aussi son lien href.
      3. Garde le footer personnalise de beehiiv separe : il ajoute les liens
         de preferences et de desinscription propres a chaque lecteur.
    -->
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">
      [[TEXTE_D_APERCU_DE_LA_NEWSLETTER]]
    </div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;background:#ececeb;">
      <tr><td align="center" style="padding:24px 12px 36px 12px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:640px;border-collapse:collapse;background:#ffffff;">
          <!-- EN-TETE -->
          <tr><td style="padding:22px 28px 20px 28px;background:#080808;border-top:4px solid #d71921;">
            <p style="margin:0 0 18px 0;font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:700;letter-spacing:1.6px;line-height:1.3;color:#f5f5f5;text-transform:uppercase;"><span style="color:#d71921;">&#9679;</span>&nbsp; CLUBS ACTIONNAIRES</p>
            <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.45;color:#b6b6b6;">L'edition du [[DATE_DE_L_EDITION]] &nbsp;&middot;&nbsp; [[NUMERO_D_EDITION]]</p>
          </td></tr>
          <!-- TITRE ET INTRODUCTION -->
          <tr><td style="padding:32px 28px 14px 28px;">
            <p style="margin:0 0 10px 0;font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:700;letter-spacing:1.4px;line-height:1.3;color:#d71921;text-transform:uppercase;">LE RENDEZ-VOUS DES ACTIONNAIRES</p>
            <h1 style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:32px;font-weight:700;letter-spacing:0;line-height:1.12;color:#111111;">[[TITRE_DE_LA_NEWSLETTER]]</h1>
            <p style="margin:18px 0 0 0;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.65;color:#424242;">[[INTRODUCTION_EN_2_OU_3_PHRASES : le fil rouge de l'edition et ce que le lecteur va en retirer.]]</p>
          </td></tr>
          <!-- POINTS A RETENIR -->
          <tr><td style="padding:14px 28px 30px 28px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;background:#f5f5f3;border-left:3px solid #d71921;"><tr><td style="padding:16px 18px;">
              <p style="margin:0 0 7px 0;font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:700;letter-spacing:1.2px;line-height:1.3;color:#d71921;text-transform:uppercase;">A retenir cette semaine</p>
              <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.65;color:#242424;"><strong>01.</strong> [[POINT_CLE_1]]<br><strong>02.</strong> [[POINT_CLE_2]]<br><strong>03.</strong> [[POINT_CLE_3]]</p>
            </td></tr></table>
          </td></tr>
          <!-- ARTICLE 1 : ANALYSE PRINCIPALE -->
          <tr><td style="padding:0 28px 30px 28px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;background:#0a0a0a;"><tr><td style="padding:26px 24px 28px 24px;">
              <p style="margin:0 0 11px 0;font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:700;letter-spacing:1.3px;line-height:1.3;color:#ff4c53;text-transform:uppercase;">01 &middot; [[RUBRIQUE_ARTICLE_1]]</p>
              <h2 style="margin:0 0 12px 0;font-family:Arial,Helvetica,sans-serif;font-size:27px;font-weight:700;letter-spacing:0;line-height:1.17;color:#ffffff;">[[TITRE_ARTICLE_1]]</h2>
              <p style="margin:0 0 16px 0;font-family:Arial,Helvetica,sans-serif;font-size:16px;font-weight:700;line-height:1.55;color:#f1f1f1;">[[CHAPO_ARTICLE_1 : pourquoi le sujet compte, en 1 ou 2 phrases.]]</p>
              <p style="margin:0 0 15px 0;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.7;color:#d0d0d0;">[[PARAGRAPHE_1_ARTICLE_1 : developpement. Tu peux conserver plusieurs paragraphes en copiant cette ligne.]]</p>
              <p style="margin:0 0 20px 0;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.7;color:#d0d0d0;">[[PARAGRAPHE_2_ARTICLE_1 : faits, conditions d'acces, chiffres ou contexte utile.]]</p>
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;"><tr><td style="background:#d71921;"><a href="[[LIEN_ARTICLE_1]]" target="_blank" style="display:inline-block;padding:12px 16px;font-family:Arial,Helvetica,sans-serif;font-size:12px;font-weight:700;letter-spacing:.6px;line-height:1.2;color:#ffffff;text-decoration:none;text-transform:uppercase;">[[CTA_ARTICLE_1]] &rarr;</a></td></tr></table>
            </td></tr></table>
          </td></tr>
          <!-- ARTICLE 2 -->
          <tr><td style="padding:0 28px 30px 28px;border-bottom:1px solid #e4e4e4;">
            <p style="margin:0 0 10px 0;font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:700;letter-spacing:1.3px;line-height:1.3;color:#d71921;text-transform:uppercase;">02 &middot; [[RUBRIQUE_ARTICLE_2]]</p>
            <h2 style="margin:0 0 12px 0;font-family:Arial,Helvetica,sans-serif;font-size:25px;font-weight:700;letter-spacing:0;line-height:1.18;color:#151515;">[[TITRE_ARTICLE_2]]</h2>
            <p style="margin:0 0 13px 0;font-family:Arial,Helvetica,sans-serif;font-size:16px;font-weight:700;line-height:1.55;color:#2e2e2e;">[[CHAPO_ARTICLE_2]]</p>
            <p style="margin:0 0 13px 0;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.7;color:#4b4b4b;">[[PARAGRAPHE_1_ARTICLE_2 : tu peux developper ce bloc sur plusieurs paragraphes selon le sujet.]]</p>
            <p style="margin:0 0 17px 0;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.7;color:#4b4b4b;">[[PARAGRAPHE_2_ARTICLE_2 : ce qu'il faut verifier ou retenir avant d'agir.]]</p>
            <a href="[[LIEN_ARTICLE_2]]" target="_blank" style="font-family:Arial,Helvetica,sans-serif;font-size:13px;font-weight:700;line-height:1.3;color:#c4141c;text-decoration:underline;">[[CTA_ARTICLE_2]] &rarr;</a>
          </td></tr>
          <!-- ARTICLE 3 -->
          <tr><td style="padding:30px 28px;border-bottom:1px solid #e4e4e4;">
            <p style="margin:0 0 10px 0;font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:700;letter-spacing:1.3px;line-height:1.3;color:#d71921;text-transform:uppercase;">03 &middot; [[RUBRIQUE_ARTICLE_3]]</p>
            <h2 style="margin:0 0 12px 0;font-family:Arial,Helvetica,sans-serif;font-size:25px;font-weight:700;letter-spacing:0;line-height:1.18;color:#151515;">[[TITRE_ARTICLE_3]]</h2>
            <p style="margin:0 0 13px 0;font-family:Arial,Helvetica,sans-serif;font-size:16px;font-weight:700;line-height:1.55;color:#2e2e2e;">[[CHAPO_ARTICLE_3]]</p>
            <p style="margin:0 0 13px 0;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.7;color:#4b4b4b;">[[PARAGRAPHE_1_ARTICLE_3]]</p>
            <p style="margin:0 0 17px 0;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.7;color:#4b4b4b;">[[PARAGRAPHE_2_ARTICLE_3 : avantages, limites et comparaison utile au lecteur.]]</p>
            <a href="[[LIEN_ARTICLE_3]]" target="_blank" style="font-family:Arial,Helvetica,sans-serif;font-size:13px;font-weight:700;line-height:1.3;color:#c4141c;text-decoration:underline;">[[CTA_ARTICLE_3]] &rarr;</a>
          </td></tr>
          <!-- ARTICLE 4 -->
          <tr><td style="padding:30px 28px 28px 28px;">
            <p style="margin:0 0 10px 0;font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:700;letter-spacing:1.3px;line-height:1.3;color:#d71921;text-transform:uppercase;">04 &middot; [[RUBRIQUE_ARTICLE_4]]</p>
            <h2 style="margin:0 0 12px 0;font-family:Arial,Helvetica,sans-serif;font-size:25px;font-weight:700;letter-spacing:0;line-height:1.18;color:#151515;">[[TITRE_ARTICLE_4]]</h2>
            <p style="margin:0 0 13px 0;font-family:Arial,Helvetica,sans-serif;font-size:16px;font-weight:700;line-height:1.55;color:#2e2e2e;">[[CHAPO_ARTICLE_4]]</p>
            <p style="margin:0 0 13px 0;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.7;color:#4b4b4b;">[[PARAGRAPHE_1_ARTICLE_4]]</p>
            <p style="margin:0 0 17px 0;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.7;color:#4b4b4b;">[[PARAGRAPHE_2_ARTICLE_4 : precise eventuellement les liens officiels, dates ou conditions.]]</p>
            <a href="[[LIEN_ARTICLE_4]]" target="_blank" style="font-family:Arial,Helvetica,sans-serif;font-size:13px;font-weight:700;line-height:1.3;color:#c4141c;text-decoration:underline;">[[CTA_ARTICLE_4]] &rarr;</a>
          </td></tr>
          <!-- CONCLUSION ACTIONNABLE -->
          <tr><td style="padding:0 28px 32px 28px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;background:#f5f5f3;border:1px solid #e3e3df;"><tr><td style="padding:20px;">
              <p style="margin:0 0 8px 0;font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:700;letter-spacing:1.3px;line-height:1.3;color:#d71921;text-transform:uppercase;">Le geste utile de la semaine</p>
              <h2 style="margin:0 0 9px 0;font-family:Arial,Helvetica,sans-serif;font-size:20px;font-weight:700;line-height:1.25;color:#151515;">[[TITRE_DU_CONSEIL_PRATIQUE]]</h2>
              <p style="margin:0 0 15px 0;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.65;color:#4b4b4b;">[[CONSEIL_PRATIQUE : une action concrete, faisable cette semaine, sans conseil financier personnalise.]]</p>
              <a href="https://clubsactionnaires.fr" target="_blank" style="font-family:Arial,Helvetica,sans-serif;font-size:13px;font-weight:700;line-height:1.3;color:#c4141c;text-decoration:underline;">Explorer le catalogue Clubs Actionnaires &rarr;</a>
            </td></tr></table>
          </td></tr>
          <!-- NOTE EDITORIALE -->
          <tr><td style="padding:0 28px 30px 28px;text-align:center;"><p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.65;color:#6b6b6b;">Les informations de cette edition sont publiees a titre educatif et informatif. Verifie toujours les conditions directement aupres des entreprises avant toute demarche.</p></td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`;
