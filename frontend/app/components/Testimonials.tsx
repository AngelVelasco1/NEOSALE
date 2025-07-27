import React, {useState, useEffect} from 'react';
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react';
import Image from 'next/image';

export const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  const testimonials = [
    {
      id: 1,
      name: "María González",
      role: "Empresaria",
      rating: 5,
      text: "NEOSALE ha transformado mi experiencia de compra online. La calidad es excepcional.",
    },
    {
      id: 2,
      name: "Carlos Rodríguez",
      role: "Desarrollador",
      rating: 5,
      text: "Interfaz intuitiva y productos tecnológicos que superan las expectativas.",
    },
    {
      id: 3,
      name: "Ana Martínez",
      role: "Diseñadora",
      rating: 5,
      text: "El diseño y la experiencia de usuario son increíbles. Cada compra es un placer.",
    },
    {
      id: 4,
      name: "Luis Fernández",
      role: "Médico",
      rating: 5,
      text: "Confiabilidad y profesionalismo que me han convertido en cliente fiel.",
    },
  ]

  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [isAutoPlaying, testimonials.length])

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    setIsAutoPlaying(false)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
    setIsAutoPlaying(false)
  }

  return (
    <section className="py-16 bg-gradient-to-b from-white via-gray-50/30 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-800 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Lo que dicen nuestros clientes
          </h2>
        </div>

        {/* Compact Main Testimonial */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="relative bg-white/60 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-lg">
            {/* Navigation Buttons */}
            <Button
              variant="default"
              size="icon"
              onClick={prevTestimonial}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white/90 border-none shadow-none rounded-full w-10 h-10 transition-all duration-200"
            >
              <ChevronLeft className="h-6 w-6 text-gray-600" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={nextTestimonial}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white/90 border-none shadow-none rounded-full w-10 h-10 transition-all duration-200"
            >
              <ChevronRight className="h-6 w-6 text-gray-600" />
            </Button>

            <div className="text-center">
              <Quote className="w-12 h-12 text-blue-500/30 mx-auto mb-6" />

              <blockquote className="text-xl md:text-2xl font-medium text-gray-800 mb-8 leading-relaxed px-10">
                {testimonials[currentIndex].text}
              </blockquote>

              <div className="flex items-center justify-center gap-4">
                <Image
                  src={"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80"}
                  alt={testimonials[currentIndex].name}
                  width={60}
                  height={60}
                  className="rounded-full shadow-lg"
                />
                <div className="text-left">
                  <div className="font-semibold text-gray-900 text-lg">{testimonials[currentIndex].name}</div>
                  <div className="text-gray-600">{testimonials[currentIndex].role}</div>
                  <div className="flex gap-1 mt-1">
                    {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Indicators */}
          <div className="flex justify-center mt-6 gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`transition-all duration-300 rounded-full ${
                  index === currentIndex
                    ? "w-8 h-3 bg-gradient-to-r from-blue-500 to-purple-500"
                    : "w-3 h-3 bg-gray-300 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Compact Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="group text-center p-6 bg-white/40 backdrop-blur-sm rounded-2xl hover:bg-white/60 transition-all duration-300 hover:-translate-y-1 shadow-sm hover:shadow-md"
            >
              <div className="flex gap-1 justify-center mb-3">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-700 text-sm mb-4 leading-relaxed">{testimonial.text}</p>
              <div className="flex items-center justify-center gap-3">
                <Image
                  src={"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80"}
                  alt={testimonial.name}
                  width={40}
                  height={40}
                  className="rounded-full shadow-md"
                />
                <div className="text-left">
                  <div className="font-semibold text-gray-900 text-sm">{testimonial.name}</div>
                  <div className="text-xs text-gray-600">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}