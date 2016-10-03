import { Accounts } from 'meteor/accounts-base';


Accounts.emailTemplates.siteName = 'Team Rushton';
Accounts.emailTemplates.from = 'Team Rushton: Accounts <accounts@example.com>';

Accounts.emailTemplates.resetPassword = {
    subject() {
        return 'Reset your Team Rushton password';
    },
    text(user, url) {
           return "Hello, " + "\n\n"
     + " To reset your password, simply click the link below:\n\n" 
     + url;
    },
    //   html(user, url) {
    //     return `
    //       XXX Generating HTML emails that work across different email clients is a very complicated
    //       business that we're not going to solve in this particular example app.
    //
    //       A good starting point for making an HTML email could be this responsive email boilerplate:
    //       https://github.com/leemunroe/responsive-html-email-template
    //
    //       Note that not all email clients support CSS, so you might need to use a tool to inline
    //       all of your CSS into style attributes on the individual elements.
    // `
    //   }
};

// Accounts.emailTemplates.resetPassword.text = function (user, url) {
//    return "Hello, " + user.username + "\n\n"
//      + " To reset your password, simply click the link below:\n\n"
//      + Meteor.absoluteUrl(url.split('#/')[1]);
// };
