// FILE: src/App.js
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Element } from 'react-scroll';
import TopBar from './components/TopBar';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import ServicesSection from './components/ServicesSection';
import WhyChooseUsSection from './components/WhyChooseUsSection';
import StatsSection from './components/StatsSection';
import TestimonialsSection from './components/TestimonialsSection';
import CTASection from './components/CTASection';
import Footer from './components/Footer';
import { AuthProvider } from './admin/context/AuthContext';
import LoginPage from './admin/pages/LoginPage';
import ProtectedRoute from './admin/components/ProtectedRoute';
import AdminLayout from './admin/components/AdminLayout';
import DashboardPage from './admin/pages/DashboardPage';
import PostListPage from './admin/pages/PostListPage';
import PostEditorPage from './admin/pages/PostEditorPage';
import BlogListPage from './blog/pages/BlogListPage';
import BlogDetailPage from './blog/pages/BlogDetailPage';

function PublicSite() {
  return (
    <div className="bg-white">
      <TopBar />
      <Header />
      <main>
        <Element name="home">
          <HeroSection />
        </Element>
        <Element name="services">
          <ServicesSection />
        </Element>
        <Element name="about-us">
          <WhyChooseUsSection />
        </Element>
        <Element name="testimonials">
          <StatsSection />
          <TestimonialsSection />
        </Element>
        <Element name="contact">
          <CTASection />
        </Element>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<PublicSite />} />
          <Route path="/blog" element={<BlogListPage />} />
          <Route path="/blog/:slug" element={<BlogDetailPage />} />
          <Route path="/admin/login" element={<LoginPage />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin/dashboard" element={<DashboardPage />} />
              <Route path="/admin/posts" element={<PostListPage />} />
              <Route path="/admin/posts/new" element={<PostEditorPage />} />
              <Route path="/admin/posts/:id/edit" element={<PostEditorPage />} />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
