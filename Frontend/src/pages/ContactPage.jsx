import React, { useState } from "react";
import { Mail, Phone, MessageSquare, Clock, MapPin, Send } from "lucide-react";

const ContactPage = ({ isDark }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [submitted, setSubmitted] = useState(false);

  const headingClass = isDark ? "text-white" : "text-gray-900";
  const textSecondaryClass = isDark ? "text-gray-400" : "text-gray-600";
  const bgClass = isDark ? "bg-slate-800" : "bg-gray-50";
  const borderClass = isDark ? "border-slate-700" : "border-gray-200";
  const inputClass = isDark 
    ? "bg-slate-700 border-slate-600 text-white placeholder-gray-400" 
    : "bg-white border-gray-300 text-gray-900";

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would send to a backend
    console.log("Form submitted:", formData);
    setSubmitted(true);
    setTimeout(() => {
      setFormData({ name: "", email: "", subject: "", message: "" });
      setSubmitted(false);
    }, 3000);
  };

  return (
    <div className={`min-h-screen py-20 px-4 transition-colors ${isDark ? "bg-slate-900" : "bg-white"}`}>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className={`text-4xl md:text-5xl font-bold ${headingClass} mb-4`}>
            Get in Touch
          </h1>
          <p className={`text-xl ${textSecondaryClass}`}>
            Have questions? We're here to help. Reach out to us using any of the methods below.
          </p>
        </div>

        {/* Contact Methods */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {/* Email */}
          <div className={`p-8 rounded-lg border text-center transition-all hover:shadow-lg ${bgClass} ${borderClass}`}>
            <Mail className="w-12 h-12 text-blue-500 mx-auto mb-4" />
            <h3 className={`text-xl font-bold ${headingClass} mb-2`}>Email</h3>
            <p className={textSecondaryClass}>
              General inquiries
            </p>
            <p className="mt-4">
              <a href="mailto:support@fraudcheckr.com" className="text-blue-500 hover:text-blue-600 font-semibold">
                support@fraudcheckr.com
              </a>
            </p>
            <p className={`text-sm ${textSecondaryClass} mt-2`}>
              Response time: 24-48 hours
            </p>
          </div>

          {/* Phone */}
          <div className={`p-8 rounded-lg border text-center transition-all hover:shadow-lg ${bgClass} ${borderClass}`}>
            <Phone className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h3 className={`text-xl font-bold ${headingClass} mb-2`}>Phone</h3>
            <p className={textSecondaryClass}>
              Urgent issues
            </p>
            <p className="mt-4">
              <a href="tel:+2348000000000" className="text-green-500 hover:text-green-600 font-semibold">
                +234 (800) 000-0000
              </a>
            </p>
            <p className={`text-sm ${textSecondaryClass} mt-2`}>
              Mon-Fri: 9 AM - 5 PM WAT
            </p>
          </div>

          {/* Office */}
          <div className={`p-8 rounded-lg border text-center transition-all hover:shadow-lg ${bgClass} ${borderClass}`}>
            <MapPin className="w-12 h-12 text-purple-500 mx-auto mb-4" />
            <h3 className={`text-xl font-bold ${headingClass} mb-2`}>Office</h3>
            <p className={textSecondaryClass}>
              Visit us in person
            </p>
            <p className="mt-4 text-sm">
              <strong>FraudCheckr HQ</strong><br />
              Lagos, Nigeria
            </p>
            <p className={`text-xs ${textSecondaryClass} mt-2`}>
              By appointment
            </p>
          </div>
        </div>

        {/* Contact Form & Info */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Form */}
          <div className="md:col-span-2">
            <div className={`p-8 rounded-lg border ${bgClass} ${borderClass}`}>
              <h2 className={`text-2xl font-bold ${headingClass} mb-6`}>
                Send us a Message
              </h2>

              {submitted ? (
                <div className="p-8 text-center bg-green-500/10 border border-green-500 rounded-lg">
                  <MessageSquare className="w-12 h-12 text-green-500 mx-auto mb-4" />
                  <p className={`${headingClass} font-semibold mb-2`}>
                    Thank you for reaching out!
                  </p>
                  <p className={textSecondaryClass}>
                    We'll get back to you as soon as possible.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name */}
                  <div>
                    <label className={`block font-semibold mb-2 ${headingClass}`}>
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="John Doe"
                      className={`w-full px-4 py-3 rounded-lg border transition ${inputClass}`}
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className={`block font-semibold mb-2 ${headingClass}`}>
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="john@example.com"
                      className={`w-full px-4 py-3 rounded-lg border transition ${inputClass}`}
                    />
                  </div>

                  {/* Subject */}
                  <div>
                    <label className={`block font-semibold mb-2 ${headingClass}`}>
                      Subject
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      placeholder="How can we help?"
                      className={`w-full px-4 py-3 rounded-lg border transition ${inputClass}`}
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label className={`block font-semibold mb-2 ${headingClass}`}>
                      Message
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      placeholder="Tell us more..."
                      rows="5"
                      className={`w-full px-4 py-3 rounded-lg border transition resize-none ${inputClass}`}
                    />
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 hover:shadow-lg transition flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    Send Message
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            {/* Hours */}
            <div className={`p-6 rounded-lg border ${bgClass} ${borderClass}`}>
              <h3 className={`text-lg font-bold ${headingClass} mb-4 flex items-center gap-2`}>
                <Clock className="w-5 h-5 text-orange-500" />
                Business Hours
              </h3>
              <div className={`space-y-2 ${textSecondaryClass} text-sm`}>
                <div className="flex justify-between">
                  <span>Monday - Friday:</span>
                  <span className="font-semibold">9 AM - 5 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday:</span>
                  <span className="font-semibold">10 AM - 2 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday:</span>
                  <span className="font-semibold">Closed</span>
                </div>
              </div>
            </div>

            {/* Department Contacts */}
            <div className={`p-6 rounded-lg border ${bgClass} ${borderClass}`}>
              <h3 className={`text-lg font-bold ${headingClass} mb-4`}>
                Departments
              </h3>
              <div className={`space-y-3 ${textSecondaryClass} text-sm`}>
                <div>
                  <p className="font-semibold text-blue-500">Support</p>
                  <p>support@fraudcheckr.com</p>
                </div>
                <div>
                  <p className="font-semibold text-blue-500">Privacy</p>
                  <p>privacy@fraudcheckr.com</p>
                </div>
                <div>
                  <p className="font-semibold text-blue-500">Legal</p>
                  <p>legal@fraudcheckr.com</p>
                </div>
                <div>
                  <p className="font-semibold text-blue-500">API Support</p>
                  <p>api@fraudcheckr.com</p>
                </div>
              </div>
            </div>

            {/* FAQ Link */}
            <div className={`p-6 rounded-lg border border-blue-500/30 ${isDark ? "bg-blue-500/10" : "bg-blue-50"}`}>
              <h3 className={`text-lg font-bold ${headingClass} mb-3`}>
                Quick Help
              </h3>
              <p className={`${textSecondaryClass} text-sm mb-4`}>
                Check our FAQ section for common questions and answers.
              </p>
              <a href="/faq" className="text-blue-500 hover:text-blue-600 font-semibold text-sm">
                View FAQ →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
