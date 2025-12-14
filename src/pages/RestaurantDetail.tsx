import React, { useEffect, useMemo, useState } from 'react'
import type { Restaurant } from "../data/Restaurants";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/Card'
import { Button } from '../components/Button'
import { ImageWithFallback } from '../components/ImageWithFallback'
import { MapPin, Star, DollarSign, ArrowLeft } from 'lucide-react'
import RatingForm from '../components/RatingForm'
import { fetchRatings, saveRating, computeAverages } from '../services/ratings'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../firebase'
