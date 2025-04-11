import React from "react";

export default function CookiesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-[#09261E] mb-6">Cookies Policy</h1>
        
        <div className="prose prose-green max-w-none">
          <p className="text-lg text-gray-700 mb-8">
            Last updated: April 11, 2025
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">What Are Cookies</h2>
          <p>
            As is common practice with almost all professional websites, PropertyDeals uses cookies, which are tiny files that are downloaded to your computer, to improve your experience. This page describes what information they gather, how we use it, and why we sometimes need to store these cookies. We will also share how you can prevent these cookies from being stored, however, this may downgrade or 'break' certain elements of the site's functionality.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">How We Use Cookies</h2>
          <p>
            We use cookies for a variety of reasons detailed below. Unfortunately, in most cases, there are no industry standard options for disabling cookies without completely disabling the functionality and features they add to this site. It is recommended that you leave on all cookies if you are not sure whether you need them or not in case they are used to provide a service that you use.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">The Cookies We Set</h2>
          
          <h3 className="text-xl font-semibold mt-6 mb-3">Account Related Cookies</h3>
          <p>
            If you create an account with us, we will use cookies for the management of the signup process and general administration. These cookies will usually be deleted when you log out, however, in some cases, they may remain afterward to remember your site preferences when logged out.
          </p>
          
          <h3 className="text-xl font-semibold mt-6 mb-3">Login Related Cookies</h3>
          <p>
            We use cookies when you are logged in so that we can remember this fact. This prevents you from having to log in every single time you visit a new page. These cookies are typically removed or cleared when you log out to ensure that you can only access restricted features and areas when logged in.
          </p>
          
          <h3 className="text-xl font-semibold mt-6 mb-3">Forms Related Cookies</h3>
          <p>
            When you submit data through a form such as those found on contact pages or comment forms, cookies may be set to remember your user details for future correspondence.
          </p>
          
          <h3 className="text-xl font-semibold mt-6 mb-3">Site Preferences Cookies</h3>
          <p>
            In order to provide you with a great experience on this site, we provide the functionality to set your preferences for how this site runs when you use it. In order to remember your preferences, we need to set cookies so that this information can be called whenever you interact with a page is affected by your preferences.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Third-Party Cookies</h2>
          <p>
            In some special cases, we also use cookies provided by trusted third parties. The following section details which third-party cookies you might encounter through this site.
          </p>
          <p>
            This site uses Google Analytics which is one of the most widespread and trusted analytics solutions on the web for helping us to understand how you use the site and ways that we can improve your experience. These cookies may track things such as how long you spend on the site and the pages that you visit so we can continue to produce engaging content.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">More Information</h2>
          <p>
            Hopefully, that has clarified things for you, and as was previously mentioned, if there is something that you aren't sure whether you need or not, it's usually safer to leave cookies enabled in case it does interact with one of the features you use on our site.
          </p>
          <p>
            If you are still looking for more information, you can contact us at cookies@propertydeals.com.
          </p>
        </div>
      </div>
    </div>
  );
}