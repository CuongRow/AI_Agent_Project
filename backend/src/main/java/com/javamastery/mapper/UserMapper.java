package com.javamastery.mapper;

import com.javamastery.dto.UserResponse;
import com.javamastery.entity.Role;
import com.javamastery.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface UserMapper {

    @Mapping(target = "roles", source = "roles", qualifiedByName = "rolesToStrings")
    UserResponse toResponse(User user);

    List<UserResponse> toResponseList(List<User> users);

    @Named("rolesToStrings")
    default List<String> rolesToStrings(Set<Role> roles) {
        if (roles == null) return List.of();
        return roles.stream()
                .map(Role::getName)
                .collect(Collectors.toList());
    }
}
