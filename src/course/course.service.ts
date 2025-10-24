import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Course } from './schemas/course.schemas';
import { Model } from 'mongoose';

@Injectable()
export class CourseService {
  constructor(@InjectModel(Course.name) private courseModel: Model<Course>) {}

  // Create a new course
  async create(createCourseDto: CreateCourseDto) {
    const newCourse = new this.courseModel(createCourseDto);
    return await newCourse.save();
  }

  // Get all courses
  async findAll() {
    const courses = await this.courseModel.find().exec();
    return courses;
  }

  // Get course by ID
  async findOne(id: string) {
    const course = await this.courseModel.findById(id).exec();
    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }
    return course;
  }

  // Update course by ID
  async update(id: string, updateCourseDto: UpdateCourseDto) {
    const updatedCourse = await this.courseModel.findByIdAndUpdate(
      id,
      updateCourseDto,
      { new: true, runValidators: true }
    );

    if (!updatedCourse) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }

    return updatedCourse;
  }

  // Delete course by ID
  async remove(id: string) {
    const deletedCourse = await this.courseModel.findByIdAndDelete(id);

    if (!deletedCourse) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }

    return { message: 'Course deleted successfully', id: deletedCourse._id };
  }
}
